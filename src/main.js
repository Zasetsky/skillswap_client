import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import '@/assets/styles/main.scss';
import AsyncComputed from "vue-async-computed";
import { connectSocket, getSocket } from "./soket";

Vue.use(AsyncComputed);

Vue.use(Vuelidate);

Vue.config.productionTip = false;

async function initApp() {
  await store.dispatch('auth/autoLogin');

  // Подключаем сокет после того, как все действия Vuex были выполнены
  const token = localStorage.getItem('token');
  if (token) {
    connectSocket(token);

    // Вызываем событие user_online
    const socket = getSocket();
    socket.emit('user_online');
  }

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
}

initApp();
