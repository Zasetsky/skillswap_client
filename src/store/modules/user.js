import axios from 'axios';
import { getSocket } from "../../soket";

const API_URL = 'http://localhost:3000/api/profile'

const state = {
  avatarUrl: null,
  bannerUrl: null,
  userProfile: {}
};

const getters = {
  getUserProfile: state => state.userProfile,
  getAvatarUrl: state => state.userProfile.avatarUrl,
};

const actions = {
  async updateBanner({ commit }, payload) {
    try {
      const formData = new FormData();
      formData.append('banner', payload.file);
      formData.append('bannerPosition', payload.bannerPosition);
  
      const response = await axios.put(`${API_URL}/banner`, formData);
  
      const bannerUrl = response.data.banner;
      commit('SET_BANNER_URL', bannerUrl);
  
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  },

  // Обновление аватарки

  async updateAvatars({ commit }, { original, cropped }) {
    console.log(original, cropped);
    try {
      const formData = new FormData();
      formData.append('original', original);
      formData.append('cropped', cropped);
  
      const response = await axios.post(`${API_URL}/avatars`, formData);
  
      const avatarUrl = response.data.avatar;
      commit("SET_AVATAR_URL", avatarUrl);
  
    } catch (error) {
      console.error("Error updating avatars:", error);
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
      
      commit('setUserProfile', response.data);
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

  SET_BANNER_URL(state, bannerUrl) {
    state.bannerUrl = bannerUrl;
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
