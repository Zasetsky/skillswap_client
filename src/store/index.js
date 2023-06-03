import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import skills from './modules/skills';
import swapRequests from './modules/swapRequests';
import user from './modules/user';
import matching from './modules/matching';
import chat from './modules/chat'
import deal from './modules/deal';
import review from './modules/review';
import dealFormLocalState from './modules/dealFormLocalState';
import dealButtonsLocalState from './modules/dealButtonsLocalState';

const watchCurrentDeal = store => {
  store.watch(
    () => store.getters['deal/getCurrentDeal'],
    (newValue) => {
      if (newValue) {
        if (
          newValue.status === "pending_update" ||
          newValue.status === "reschedule_offer_update" ||
          newValue.status === "reschedule_offer"
        ) {
          store.dispatch('dealFormLocalState/handleFormFilling', {
            formFromDeal: newValue.update && newValue.update.form,
            form2FromDeal: newValue.update && newValue.update.form2,
          });
        } else {
          store.dispatch('dealFormLocalState/handleFormFilling', {
            formFromDeal: newValue.form,
            form2FromDeal: newValue.form2,
          });
        }
      } else {
        store.dispatch('dealFormLocalState/fillForm', { formName: 'form1', source: {} });
        store.dispatch('dealFormLocalState/fillForm', { formName: 'form2', source: {} });
        store.commit('dealFormLocalState/SET_COMMON_MEETING_DURATION', null);
      }
    },
    { deep: true }
  );
};

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    skills,
    swapRequests,
    user,
    matching,
    chat,
    deal,
    review,
    dealFormLocalState,
    dealButtonsLocalState,
  },
  plugins: [watchCurrentDeal]
});