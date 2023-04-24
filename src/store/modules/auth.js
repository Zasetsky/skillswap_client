import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { connectSocket } from "../../soket";

const API_URL = 'http://localhost:3000/api/auth'; 

// Настройка Axios interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const state = {
  user: null,
  token: localStorage.getItem('token') || '',
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
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

      // Подключаем сокет после успешной регистрации
      connectSocket(token);

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

      // Подключаем сокет после успешной авторизации
      connectSocket(token);

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

      try {
        const response = await axios.get(`${API_URL}/user`);

        // Подключаем сокет после автоматической авторизации
        connectSocket(token);

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

const mutations = {
  setUser(state, user) {
    state.user = user;
    console.log(user);
  },
  setToken(state, token) {
    state.token = token;
  },
  logout(state) {
    state.user = null;
    state.token = '';
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
