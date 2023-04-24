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

  getCurrentDeal({ commit }, chatId) {
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

  updateDeal({ commit }, { dealId, status, senderId, formData1, formData2 }) {
      const data = { dealId, status, senderId, formData1, formData2 };

      const socket = getSocket();

      socket.emit("updateDeal", data);

      socket.on("deal", (updatedDeal) => {
      commit("UPDATE_DEAL", { dealId, deal: updatedDeal });
      });

      socket.on("error", (error) => {
      console.error("Error updating deal:", error.message);
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
    console.log(dealId);
    const socket = getSocket();

    socket.emit("confirmDeal", dealId);

    socket.on("dealConfirmed", (deal) => {
    commit("UPDATE_DEAL", deal);
    });

    socket.on("error", (error) => {
    console.error("Error confirming deal:", error.message);
    });
  },
};

const mutations = {
  UPDATE_DEAL(state, { dealId, deal }) {
    const index = state.deals.findIndex((d) => d._id === dealId);
    if (index !== -1) {
      state.deals.splice(index, 1, deal);
    }
  },

  SET_CURRENT_DEAL: (state, deal) => {
    state.currentDeal = deal;
  },

  SET_DEALS(state, deals) {
    state.deals = deals;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
