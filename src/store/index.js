import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import skills from './modules/skills';
import swapRequests from './modules/swapRequests';
import user from './modules/user';
import matching from './modules/matching';
import chat from './modules/chat'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    skills,
    swapRequests,
    user,
    matching,
    chat,
  }
});