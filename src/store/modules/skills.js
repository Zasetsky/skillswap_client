import axios from 'axios';

const state = {
  availableSkills: [],
  // другие состояния
};

const mutations = {
  setAvailableSkills(state, availableSkills) {
    state.availableSkills = availableSkills;
  },
  // другие мутации
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
  // другие действия
};

const getters = {
    getSkillList: (state) => state.availableSkills,
    // другие геттеры
};

export default {
  state,
  mutations,
  actions,
  getters
};