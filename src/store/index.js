import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/modules/auth';
import messages from '@/store/modules/messages';
import skills from '@/store/modules/skills';
import notifications from '@/store/modules/notifications';
import swapRequests from '@/store/modules/swapRequests';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    messages,
    skills,
    notifications,
    swapRequests,
  },
});
