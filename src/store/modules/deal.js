import { getSocket } from "../../soket";

const state = {
  deals: [],
  currentDeal: null,
};

const getters = {
  getCurrentDeal: (state) => state.currentDeal,
  getAllDeals: (state) => state.deals,
};

const actions = {
  createOrGetCurrentDeal({ commit }, { participants, chatId, swapRequestId }) {
    const data = { participants, chatId, swapRequestId };

    return new Promise((resolve, reject) => {
      const socket = getSocket();

      socket.emit("createOrGetCurrentDeal", data);
  
      socket.once("deal", (newDeal) => {
        commit("SET_CURRENT_DEAL", newDeal);
        resolve(newDeal);
      });
  
      socket.once("error", (error) => {
        console.error("Error creating deal:", error.message);
        reject(error);
      });
    });
  },

  fetchCurrentDeal({ commit }, chatId) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();

      socket.emit("getCurrentDeal", chatId);
  
      socket.on("currentDeal", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
        resolve(deal);
      });
  
      socket.once("error", (error) => {
        console.error("Error fetching current deal:", error.message);
        reject(error);
      });
    });
  },

  listenForDealUpdates({ commit }) {
    const socket = getSocket();

    socket.on('dealUpdated', (updatedDeal) => {
      commit('SET_CURRENT_DEAL', updatedDeal);
    });

    socket.on('error', (error) => {
      console.error('Error while listening for deal updates:', error.message);
    });
  },

  updateDeal({ commit }, { dealId, formData1, formData2 }) {
      const data = { dealId, formData1, formData2 };

      const socket = getSocket();

      socket.emit("updateDeal", data);

      socket.on("deal", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
      // commit("UPDATE_DEAL", { dealId, deal });
      });

      socket.on("error", (error) => {
      console.error("Error updating deal:", error.message);
      });
  },

  proposeRescheduleDeal({ commit }, { dealId, rescheduleFormData1, rescheduleFormData2 }) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();

      const data = { dealId, rescheduleFormData1, rescheduleFormData2 };
      socket.emit("proposeReschedule", data);

      socket.on("deal", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
        resolve(deal);
      });

      socket.once("error", (error) => {
        console.error("Error proposing reschedule:", error.message);
        reject(error);
      });
    });
  },

  confirmReschedule({ commit }, dealId) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
  
      socket.emit("confirmReschedule", dealId);
  
      socket.on("rescheduleConfirmed", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
        resolve(deal);
      });
  
      socket.on("error", (error) => {
        console.error("Error confirming reschedule:", error.message);
        reject(error);
      });
    });
  },  
  
  async getAllDeals({ commit }) {
      return new Promise((resolve, reject) => {
      try {
        const socket = getSocket();

        socket.emit("getAllDeals");
        socket.on("allDeals", (deals) => {
          commit("SET_DEALS", deals);
          resolve(deals);
        });
      } catch (error) {
          console.error("Error fetching all deals:", error);
          reject(error);
      }
      });
  },

  confirmDeal({ commit }, dealId) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
  
      socket.emit("confirmDeal", dealId);
  
      socket.on("dealConfirmed", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
        resolve(deal);
      });
  
      socket.on("error", (error) => {
        console.error("Error confirming deal:", error.message);
        reject(error);
      });
    });
  },

  // Отмена
  requestCancellation({ commit }, { dealId, reason, timestamp }) {
    const socket = getSocket();

    const data = { dealId, reason, timestamp };

    socket.emit("requestCancellation", data);

    socket.on("cancellationRequested", (deal) => {
      commit("SET_CURRENT_DEAL", deal);
    });
  
    socket.on("error", (error) => {
      console.error("Error during send request cancellation deal:", error.message);
    });
  },

  // approveCancellation({ commit }, { dealId }) {
  //   const socket = getSocket();

  //   socket.emit("approveCancellation", { dealId });
  // },

  // rejectCancellation({ commit }, { dealId }) {
  //   const socket = getSocket();

  //   socket.emit("rejectCancellation", { dealId });
  // },

    // approveCancellation({ commit }, { dealId }) {
  //   const socket = getSocket();

  //   socket.emit("approveCancellation", { dealId });
  // },

  // rejectCancellation({ commit }, { dealId }) {
  //   const socket = getSocket();

  //   socket.emit("rejectCancellation", { dealId });
  // },

  // продолжение
  requestContinuation({ commit }, dealId) {
    const socket = getSocket();

    socket.emit("requestContinuation", dealId);

    socket.on("continuationRequested", (deal) => {
      commit("SET_CURRENT_DEAL", deal);
    });
  
    socket.on("error", (error) => {
      console.error("Error during sending request continuation deal:", error.message);
    });
  },

  rejectContinuation({ commit }, { dealId }) {
    const socket = getSocket();

    socket.emit("rejectContinuation", { dealId });

    socket.on("continuationRejected", (deal) => {
      commit("SET_CURRENT_DEAL", deal);
    });

    socket.on("error", (error) => {
      console.error("Error during rejecting request continuation deal:", error.message);
    });
  },

  approveContinuation({ commit }, { dealId }) {
    const socket = getSocket();

    socket.emit("approveContinuation", { dealId });

    socket.on("continuationApproved", (deal) => {
      commit("SET_CURRENT_DEAL", deal);
    });

    socket.on("error", (error) => {
      console.error("Error during approving request continuation deal:", error.message);
    });
  },
};

const mutations = {
  // UPDATE_DEAL(state, { dealId, deal }) {
  //   const index = state.deals.findIndex((d) => d._id === dealId);
  //   if (index !== -1) {
  //     state.deals.splice(index, 1, deal);
  //   }
  // },

  SET_CURRENT_DEAL: (state, deal) => {
    state.currentDeal = deal;
  },

  SET_DEALS(state, deals) {
    state.deals = deals;
  },

  logout(state) {
    state.deals = [];
    state.currentDeal = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
