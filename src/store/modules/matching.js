import axios from 'axios';

const API_URL = 'http://localhost:3000/api/matching';

const state = {
  matchingUsers: [],
  selectedSkill: []
};

const getters = {
  getMatchingUsers: (state) => state.matchingUsers,
  getSelectedSkill: (state) => state.selectedSkill
};

const actions = {
    async fetchMatchingUsers({ commit }, selectedSkillId) {
      try {
        const response = await axios.post(`${API_URL}/findMatchingUsers`, { skillId: selectedSkillId });
        
        commit('SET_MATCHING_USERS', response.data.matchingUsers);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    setSelectedSkill({ commit }, skill) {
      commit("SET_SELECTED_SKILL", skill)
    }
};

const mutations = {
  SET_MATCHING_USERS: (state, matchingUsers) => state.matchingUsers = matchingUsers,

  SET_SELECTED_SKILL: (state, skill) => state.selectedSkill = skill, 

  logout(state) {
    state.matchingUsers = [];
  },
};



export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
