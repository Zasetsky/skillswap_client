import axios from 'axios';

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
            const response = await axios.get('http://localhost:3000/api/skills/available-skills');
            commit('setAvailableSkills', response.data);
        } catch (error) {
            console.error('Error during fetching available skills:', error);
        }
    },

    async addStrongSkills({ commit }, strongSkills) {
        try {
            const response = await axios.post('http://localhost:3000/api/skills/add-skills-to-teach', { skills: strongSkills });
            commit('updateUser', response.data.user); // Обновите пользовательские данные в состоянии хранилища
            console.log(response.data.user);
            } catch (error) {
            console.error('Error during adding strong skills:', error);
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