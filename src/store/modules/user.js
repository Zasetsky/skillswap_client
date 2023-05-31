import axios from 'axios';
import { getSocket } from "../../soket";

const API_URL = 'http://localhost:3000/api/profile'

const state = {
  avatarUrl: null,
  userProfile: {}
};

const getters = {
  getUserProfile: state => state.userProfile,
  getAvatarUrl: state => state.userProfile.avatarUrl,
};

const actions = {

  // Обновление аватарки

  async updateAvatar({ commit }, file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${API_URL}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const avatarUrl = response.data.avatar;
      commit("SET_AVATAR_URL", avatarUrl);

    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  },

  // Обновление информации о пользователе

  async updateProfile(context, userProfile) {
    try {
      await axios.put(`${API_URL}/update`, userProfile, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  // Получение геолокации
  // 
  // async getCurrentLocation() {
  //   return new Promise((resolve, reject) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           resolve({ latitude, longitude });
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     } else {
  //       reject(new Error('Geolocation not supported in this browser'));
  //     }
  //   });
  // },

  // Обновление доступности для обмена

  async isPreSetupToggle({ commit }) {
    try {
      const response = await axios.post(`${API_URL}/isPreSetup`);
  
      console.log('Server: ', response.data);
  
      commit('auth/setUser', response.data.user, { root: true });
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  },

  // Запрос профиля пользователя

  async fetchUserProfile({ commit }, userId) {
    try {
      const response = await axios.get(`${API_URL}/current/${userId}`);
      
      commit('setUserProfile', response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  },

  async fetchCurrentUser({ commit }) {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/user`);
      commit('auth/setUser', {...response.data.user}, { root: true });
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  },

  listenForUserUpdates({ commit }) {
    const socket = getSocket();

    socket.on("userUpdated", (updatedUser) => {
      commit('auth/setUser', updatedUser, { root: true });
    });
  },

};

const mutations = {
  SET_AVATAR_URL(state, avatarUrl) {
    state.avatarUrl = avatarUrl;
  },
  setUserProfile(state, userProfile) {
    state.userProfile = userProfile;
  },

  logout(state) {
    state.userProfile = {};
    state.avatarUrl = null;
  },
};


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
