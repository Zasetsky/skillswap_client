import { getSocket } from "../../soket";

const state = {
  deals: [],
  currentDeal: null,
  isSending: false,
};

const getters = {
  getCurrentDeal: (state) => state.currentDeal,
  getAllDeals: (state) => state.deals,
  getIsSending: (state) => state.isSending,
};

const actions = {
  listenIsSending({ commit }) {
    const socket = getSocket();

    socket.on("isSending", () => {
      commit("SET_IS_SENDING");
    });
  },

  createDeal({ commit }, { participants, requestId, chatId }) {
    const data = { participants, requestId, chatId };

    const socket = getSocket();

    return new Promise((resolve, reject) => {
    socket.emit("createDeal", data);

    socket.once("newDeal", (newDeal) => {
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
  
      socket.once("currentDeal", (deal) => {
        commit("SET_CURRENT_DEAL", deal);
        resolve(deal);
      });
  
      socket.once("error", (error) => {
        console.error("Error fetching current deal:", error.message);
        reject(error);
      });
    });
  },

  listenForDealObserver({ commit, state }) {
    const socket = getSocket();
  
    socket.on('dealUpdated', (updatedDeal) => {
      if (state.currentDeal && updatedDeal._id === state.currentDeal._id) {
        commit('SET_CURRENT_DEAL', updatedDeal);
        if(state.isSending === true) {
          commit("SET_IS_SENDING");
        }
      }
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

  listenForDealUpdates({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("deal", (deal) => {
        if(state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
        }
      });
    } catch (error) {
        console.error("Error listening for Deal Updates:", error);
    }
  },

  proposeRescheduleDeal(context, { dealId, formData1, formData2 }) {
    const socket = getSocket();

    const data = { dealId, formData1 };
  
    if (formData2) {
      Object.assign(data, {formData2});
    }

    socket.emit("proposeReschedule", data);
  
    socket.once("error", (error) => {
      console.error("Error proposing reschedule:", error.message);
    });
  },

  confirmReschedule(context, dealId) {
    const socket = getSocket();

    socket.emit("confirmReschedule", dealId);

    socket.on("error", (error) => {
      console.error("Error confirming reschedule:", error.message);
    });
  },

  rejectReschedule(context, dealId) {
    const socket = getSocket();

    socket.emit("rejectReschedule", dealId);

    socket.on("error", (error) => {
      console.error("Error confirming reschedule:", error.message);
    });
  },

  listenForRescheduleConfirmed({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("rescheduleConfirmed", (deal) => {
        if (state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
        }
      });
    } catch (error) {
      console.error("Error listening for Reschedule Confirmed:", error);
    }
  },


  fetchAllDeals({ commit }) {
    const socket = getSocket();

    socket.emit("getAllDeals");

    socket.on("allDeals", (deals) => {
      commit("SET_DEALS", deals);
    });

    socket.on("error", (error) => {
      console.error("Error geting all deals:", error.message);
    });
  },

  confirmDeal(context, dealId) {
    const socket = getSocket();

    socket.emit("confirmDeal", dealId);

    socket.on("error", (error) => {
      console.error("Error confirming deal:", error.message);
    });
  },

  listenForDealConfirmed({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("dealConfirmed", (deal) => {
        if (state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
        }
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

  listenForCancellationRequested({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("cancellationRequested", (deal) => {
        if (state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
        }
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

  listenForApproveCancellation({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("cancellationApproved", (deal) => {
        if (state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
        }
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
  requestContinuation({ commit }, dealId) {
    const socket = getSocket();
  
    return new Promise((resolve, reject) => {

      socket.emit("requestContinuation", dealId);
    
      socket.on("error", (error) => {
        console.error("Error during sending request continuation deal:", error.message);
        reject(error);
      });
    
      socket.on("notActiveSkills", () => {
        resolve();
        commit("SET_IS_SENDING")
        socket.emit("toggleIsSending", dealId);
      });
    });
  },

  listenForContinuationRequested({ commit, state }) {
    try {
      const socket = getSocket();
  
      socket.on("continuationRequested", (deal) => {
        if (state.currentDeal && deal._id === state.currentDeal._id) {
          commit("SET_CURRENT_DEAL", deal);
          if(state.isSending === true) {
            commit("SET_IS_SENDING");
          } 
        }
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

  approveContinuation({ commit }, { dealId }) {
    const socket = getSocket();

    socket.emit("approveContinuation", { dealId });

    socket.on("notActiveSkills", () => {
      commit("SET_IS_SENDING")
      socket.emit("toggleIsSending", dealId);
    });

    socket.on("error", (error) => {
      console.error("Error during approving request continuation deal:", error.message);
    });
  },

  listenForApproveContinuation({ commit, state, rootState }) {
    try {
      const socket = getSocket();
  
      socket.on("continuationApproved", (deal) => {
        const currentChat = rootState.chat.currentChat;
        if (currentChat && deal.chatId === currentChat._id) {
          commit("SET_CURRENT_DEAL", deal);
          if(state.isSending === true) {
            commit("SET_IS_SENDING");
          }
        }
      });
    } catch (error) {
      console.error("Error listening for Cancellation Requested:", error);
    }
  },
};

const mutations = {
  SET_IS_SENDING: (state) => {
    state.isSending = !state.isSending
    console.log('isSending:', state.isSending);
  },
  
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
