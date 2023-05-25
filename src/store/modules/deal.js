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

  listenForDealObserver(context) {
    const socket = getSocket();

    socket.on('dealUpdated', (updatedDeal) => {
      context.commit('SET_CURRENT_DEAL', updatedDeal);
    });

    socket.on('error', (error) => {
      console.error('Error while listening for Deal Observer:', error.message);
    });
  },

  updateDeal(context, { dealId, formData1, formData2 }) {
    const data = { dealId, formData1, formData2 };

    const socket = getSocket();

    socket.emit("updateDeal", data);

    socket.on("error", (error) => {
    console.error("Error updating deal:", error.message);
    });
  },

  listenForDealUpdates(context) {
    try {
      const socket = getSocket();

      socket.on("deal", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Deal Updates:", error);
    }
  },

  proposeRescheduleDeal(context, { dealId, rescheduleFormData1, rescheduleFormData2 }) {
    const socket = getSocket();

    const data = { dealId, rescheduleFormData1, rescheduleFormData2 };
    console.log(data);
    socket.emit("proposeReschedule", data);

    socket.once("error", (error) => {
      console.error("Error proposing reschedule:", error.message);
    });
  },

  confirmReschedule(context, dealId) {
    const socket = getSocket();
    console.log(dealId);
    socket.emit("confirmReschedule", dealId);

    socket.on("error", (error) => {
      console.error("Error confirming reschedule:", error.message);
    });
  },

  listenForRescheduleConfirmed(context) {
    try {
      const socket = getSocket();

      socket.on("rescheduleConfirmed", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
  } catch (error) {
      console.error("Error listening for Reschedule Confirmed:", error);
  }
  },


  getAllDeals({ commit }) {
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

  confirmDeal(context, dealId) {
    const socket = getSocket();
    console.log(dealId);

    socket.emit("confirmDeal", dealId);

    socket.on("error", (error) => {
      console.error("Error confirming deal:", error.message);
    });
  },

  listenForDealConfirmed(context) {
    try {
      const socket = getSocket();

      socket.on("dealConfirmed", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Deal Confirmed:", error);
    }
  },

  // Отмена
  requestCancellation(context, { dealId, reason, timestamp }) {
    const socket = getSocket();

    const data = { dealId, reason, timestamp };

    socket.emit("requestCancellation", data);

    socket.on("error", (error) => {
      console.error("Error during send request cancellation deal:", error.message);
    });
  },

  listenForCancellationRequested(context) {
    try {
      const socket = getSocket();

      socket.on("cancellationRequested", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Cancellation Requested:", error);
    }
  },

  approveCancellation(context, { dealId }) {
    const socket = getSocket();

    socket.emit("approveCancellation", { dealId });

    socket.on("error", (error) => {
      console.error("Error during approving cancellation deal:", error.message);
    });
  },

  listenForApproveCancellation(context) {
    try {
      const socket = getSocket();

      socket.on("cancellationApproved", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Cancellation Requested:", error);
    }
  },

  rejectCancellation(context, { dealId }) {
    const socket = getSocket();

    socket.emit("rejectCancellation", { dealId });

    socket.on("error", (error) => {
      console.error("Error during rejecting cancellation deal:", error.message);
    });
  },

  // продолжение
  requestContinuation(context, dealId) {
    const socket = getSocket();

    socket.emit("requestContinuation", dealId);

    socket.on("error", (error) => {
      console.error("Error during sending request continuation deal:", error.message);
    });
  },

  listenForContinuationRequested(context) {
    try {
      const socket = getSocket();

      socket.on("continuationRequested", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Cancellation Requested:", error);
    }
  },

  rejectContinuation(context, { dealId }) {
    const socket = getSocket();

    socket.emit("rejectContinuation", { dealId });

    socket.on("error", (error) => {
      console.error("Error during rejecting request continuation deal:", error.message);
    });
  },

  approveContinuation(context, { dealId }) {
    const socket = getSocket();

    socket.emit("approveContinuation", { dealId });

    socket.on("error", (error) => {
      console.error("Error during approving request continuation deal:", error.message);
    });
  },

  listenForApproveContinuation(context) {
    try {
      const socket = getSocket();

      socket.on("continuationApproved", (deal) => {
        context.commit("SET_CURRENT_DEAL", deal);
      });
    } catch (error) {
        console.error("Error listening for Cancellation Requested:", error);
    }
  },
};

const mutations = {
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
