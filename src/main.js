import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import '@/assets/styles/main.scss';

Vue.use(Vuelidate);

Vue.config.productionTip = false;

async function initApp() {
  await store.dispatch('auth/autoLogin');

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
}

initApp();
