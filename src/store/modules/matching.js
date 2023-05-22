import axios from 'axios';

const API_URL = 'http://localhost:3000/api/matching';

const state = {
  matchingUsers: [],
};

const getters = {
  matchingUsers: (state) => state.matchingUsers,
};

const actions = {
    async fetchMatchingUsers({ commit }, selectedSkillId) {
        try {
          const response = await axios.post(`${API_URL}/findMatchingUsers`, { skillId: selectedSkillId });
          commit('setMatchingUsers', response.data);
          return response.data
        } catch (error) {
          console.error(error);
          throw error;
        }
    },    
};

const mutations = {
  setMatchingUsers: (state, matchingUsers) => (state.matchingUsers = matchingUsers),
};



export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
