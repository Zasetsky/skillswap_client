const state = {
    isConfirmButtonVisible: null
  };
  
  const getters = {
    getIsConfirmButtonVisible: (state) => state.isConfirmButtonVisible
  };
  
  const actions = {
    setIsConfirmButtonVisible({ commit }, value) {
        commit('SET_CONFIRM_BUTTON_VISIBLE', value);
    }
  };
  
  const mutations = {
    SET_CONFIRM_BUTTON_VISIBLE(state, value) {
      state.isConfirmButtonVisible = value;
    },
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };
  