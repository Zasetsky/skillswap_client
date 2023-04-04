import axios from 'axios';

const API_URL = 'http://localhost:3000/api/skills/'

const state = {
  availableSkills: [],

};

const mutations = {
  setAvailableSkills(state, availableSkills) {
    state.availableSkills = availableSkills;
  },
  updateUser(state, user) {
    state.user = user;
  }
};

const actions = {
    async fetchAvailableSkills({ commit }) {
        try {
            const response = await axios.get(`${API_URL}/available-skills`);
            commit('setAvailableSkills', response.data);
        } catch (error) {
            console.error('Error during fetching available skills:', error);
        }
    },

    async addStrongSkills({ commit }, strongSkills) {
        try {
            const response = await axios.post(`${API_URL}/add-skills-to-teach`, { skills: strongSkills });
            commit('updateUser', response.data.user);
            console.log(response.data.user);
            } catch (error) {
            console.error('Error during adding strong skills:', error);
        }
    },

    async addWeakSkills({ commit }, weakSkills) {
        try {
        const response = await axios.post(`${API_URL}/add-skills-to-learn`, { skills: weakSkills });
        commit('updateUser', response.data.user);
        console.log(response.data.user);
        } catch (error) {
        console.error('Error during adding weak skills:', error);
        }
    }
  
  
};

const getters = {
    getSkillList: (state) => state.availableSkills,

};

export default {
  state,
  mutations,
  actions,
  getters
};