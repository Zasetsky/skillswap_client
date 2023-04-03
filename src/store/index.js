import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import messages from './modules/messages';
import skills from './modules/skills';
import notifications from './modules/notifications';
import swapRequests from './modules/swapRequests';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    messages,
    skills,
    notifications,
    swapRequests,
    user
  }
});