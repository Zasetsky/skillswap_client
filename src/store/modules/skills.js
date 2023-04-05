import axios from 'axios';

const API_URL = 'http://localhost:3000/api/skills/'

const state = {
  availableSkills: [],

};

const mutations = {
  setAvailableSkills(state, availableSkills) {
    state.availableSkills = availableSkills;
  },
};

const actions = {

  // Получение списка доступных навыков

    async fetchAvailableSkills({ commit }) {
        try {
            const response = await axios.get(`${API_URL}/available-skills`);
            commit('setAvailableSkills', response.data);
        } catch (error) {
            console.error('Error during fetching available skills:', error);
        }
    },

    // Добавление навыков пользователю для преподавания 

    async addStrongSkills(context, strongSkills) {
        try {
            await axios.post(`${API_URL}/add-skills-to-teach`, { skills: strongSkills });
            } catch (error) {
            console.error('Error during adding strong skills:', error);
        }
    },

    // Добавление навыков пользователю для изучения 

    async addWeakSkills(context, weakSkills) {
        try {
          await axios.post(`${API_URL}/add-skills-to-learn`, { skills: weakSkills });
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