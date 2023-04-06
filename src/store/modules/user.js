import axios from 'axios';
import store from '@/store';

const API_URL = 'http://localhost:3000/api/profile'

const state = {
  avatarUrl: null,
  userProfile: {}
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

  async updateUserAvailability(context, userChoice) {
    try {
      console.log('Sending availability update request:', userChoice);
      const response = await axios.post(`${API_URL}/availability`, {
        availability: userChoice,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Обработка ответа сервера
      console.log('Server: ', response.data);
  
      // Обновление текущего пользователя в состоянии приложения
      store.commit('auth/setUser', response.data.user, { root: true });
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

};

const mutations = {
  SET_AVATAR_URL(state, avatarUrl) {
    state.avatarUrl = avatarUrl;
  },
  setUserProfile(state, userProfile) {
    state.userProfile = userProfile;
  },
};


const getters = {
  getAvatarUrl: state => state.userProfile.avatarUrl,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
