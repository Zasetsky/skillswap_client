const state = {
  isConfirmButtonVisible: null,
  isDialogOpen: false,
};

const getters = {
  getIsConfirmButtonVisible: (state) => state.isConfirmButtonVisible,

  getIsDialogOpen: (state) => state.isDialogOpen,
};

const actions = {
  setIsConfirmButtonVisible({ commit }, value) {
    commit('SET_CONFIRM_BUTTON_VISIBLE', value);
  },

  setIsDialogOpen({ commit }, value) {
    commit('SET_DIALOG_OPEN', value);
  },
};

const mutations = {
  SET_CONFIRM_BUTTON_VISIBLE(state, value) {
    state.isConfirmButtonVisible = value;
  },

  SET_DIALOG_OPEN(state, value) {
    state.isDialogOpen = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
