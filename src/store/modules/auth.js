import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:3000/api/auth'; 

const state = {
  user: null,
  token: localStorage.getItem('token') || '',
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  },
  logout(state) {
    state.user = null;
    state.token = '';
  },
};

const actions = {
  async register({ commit }, { name, email, password }) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      // Сохраняем токен в localStorage и в state
      localStorage.setItem('token', token);
      commit('setToken', token);

      // Сохраняем информацию о пользователе в state
      commit('setUser', user);

      // Установка заголовка авторизации для всех будущих запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  async login({ commit }, { email, password }) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      // Сохраняем токен в localStorage и в state
      localStorage.setItem('token', token);
      commit('setToken', token);
      
      // Сохраняем информацию о пользователе в state
      commit('setUser', user);
      console.log(user);

      // Установка заголовка авторизации для всех будущих запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  logout({ commit }) {
    // Удаление токена из localStorage и очистка состояния
    localStorage.removeItem('token');
    commit('logout');

    // Удаление заголовка авторизации для всех будущих запросов
    delete axios.defaults.headers.common['Authorization'];
  },


  async autoLogin({ commit, dispatch, state }) {
    const token = state.token;

    if (token) {
      // Проверяем срок действия токена
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      // Если токен истек, выполните выход
      if (isTokenExpired) {
        dispatch('logout');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        commit('setUser', response.data.user);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Если токен истек или недействителен, выполните выход
          dispatch('logout');
        } else {
          // Выводите сообщение об ошибке только в случае, если код состояния не равен 401
          console.error('Error during auto-login:', error);
        }
      }
    }
  },

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
