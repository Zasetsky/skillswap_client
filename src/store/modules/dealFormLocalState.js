const state = {
  form1: {
    meetingDate: null,
    meetingTime: null,
  },
  form2: {
    meetingDate: null,
    meetingTime: null,
  },
  commonMeetingDuration: null,
};

const getters = {
  getForm1: state => state.form1,

  getForm2: state => state.form2,

  commonMeetingDuration: state => state.commonMeetingDuration,

  completedForms: (state, getters, rootState, rootGetters) => {
    const form1IsCompleted = rootGetters['deal/getCurrentDeal']?.form?.isCompleted;
    const form2IsCompleted = rootGetters['deal/getCurrentDeal']?.form2?.isCompleted;

    return {
      form1: form1IsCompleted,
      form2: form2IsCompleted
    };
  }
};

const actions = {
  setForm1({ commit }, form) {
    commit('SET_FORM1', form);
  },

  setForm2({ commit }, form) {
    commit('SET_FORM2', form);
  },

  setCommonMeetingDuration({ commit }, duration) {
    return new Promise((resolve) => {
      commit('SET_COMMON_MEETING_DURATION', duration);
      resolve();
    });
  },

  fillForm({ commit }, { formName, source }) {
    commit('FILL_FORM', { formName, source });
  },

  handleFormFilling({ dispatch, getters }, { formFromDeal, form2FromDeal }) {
    if(formFromDeal || form2FromDeal) {
      const completedForms = getters.completedForms;
      if (!completedForms.form1 && !completedForms.form2) {
        dispatch('fillForm', { formName: 'form1', source: formFromDeal });
        dispatch('fillForm', { formName: 'form2', source: form2FromDeal });
        dispatch('updateCommonMeetingDuration', formFromDeal);
      } else if (completedForms.form1 && !completedForms.form2) {
        dispatch('fillForm', { formName: 'form1', source: form2FromDeal });
        dispatch('updateCommonMeetingDuration', form2FromDeal);
      } else if (!completedForms.form1 && completedForms.form2) {
        dispatch('fillForm', { formName: 'form1', source: formFromDeal });
        dispatch('updateCommonMeetingDuration', formFromDeal);
      }
    }
  },

  resetForm({ commit }) {
    const initialFormState = {
      meetingDate: null,
      meetingTime: null,
    };

    commit('SET_FORM1', initialFormState);
    commit('SET_FORM2', initialFormState);
    commit('SET_COMMON_MEETING_DURATION', null);
  },

  updateCommonMeetingDuration({ commit }, form) {
    const commonMeetingDuration = form ? form.meetingDuration : null;
    commit('SET_COMMON_MEETING_DURATION', commonMeetingDuration);
  },
};

const mutations = {
  SET_FORM1(state, form) {
    state.form1 = form;
  },

  SET_FORM2(state, form) {
    state.form2 = form;
  },

  FILL_FORM(state, { formName, source }) {
    const form = state[formName];
    if (!form) {
      console.error(`Form ${formName} not found in state`);
      return;
    }
    Object.keys(form).forEach((field) => {
      form[field] = source[field] || null;
    });
    state[formName] = JSON.parse(JSON.stringify(form));  // Глубокая копия
  },

  SET_COMMON_MEETING_DURATION(state, duration) {
    state.commonMeetingDuration = duration;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
