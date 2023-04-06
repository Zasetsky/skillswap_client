import axios from 'axios';

const API_URL = 'http://localhost:3000/api/matching';

const state = {
  matchingUsers: [],
};

const getters = {
  matchingUsers: (state) => state.matchingUsers,
};

const actions = {
    async fetchMatchingUsers({ commit, rootState }, selectedSkillToLearn) {
        try {
          const response = await axios.post(`${API_URL}/findMatchingUsers`, {
            currentUserId: rootState.auth.user._id,
            skillToLearn: selectedSkillToLearn,
          });
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
  getters,
  actions,
  mutations,
};
