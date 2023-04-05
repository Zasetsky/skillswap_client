import axios from 'axios';

const API_URL = 'http://localhost:3000/api/profile'

const state = {
  userProfile: {
    avatarUrl: null,
    name: null,
    strongSkills: [],
    weakSkills: [],
    exchangePreferences: [],
  },
};

const mutations = {
  SET_USER_PROFILE(state, userProfile) {
    state.userProfile = userProfile;
  },
  SET_AVATAR_URL(state, avatarUrl) {
    state.userProfile.avatarUrl = avatarUrl;
  },
};

const actions = {
  setUserProfile({ commit }, userProfile) {
    commit("SET_USER_PROFILE", userProfile);
  },

  setAvatarUrl({ commit }, avatarUrl) {
    commit("SET_AVATAR_URL", avatarUrl);
  },

  // Обновление аватарки

  async updateAvatar({ commit }, file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      console.log('Authorization header:', axios.defaults.headers.common['Authorization']);
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  // Получение геолокации

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported in this browser'));
      }
    });
  },

  // Обновление доступности для обмена

  async updateUserAvailability(context, userChoice) {
    try {
      console.log('Sending availability update request:', userChoice);
      const response = await axios.post(`${API_URL}/availability`, {
        availability: userChoice,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Обработка ответа сервера
      console.log('Server: ', response.data);
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  },  

};


const getters = {
  getUserProfile: state => state.userProfile,
  getAvatarUrl: state => state.userProfile.avatarUrl,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
