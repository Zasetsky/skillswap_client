import io from "socket.io-client";

const API_URL = "http://localhost:3000/";
const socket = io(API_URL);

const state = {
  swapRequests: [],
};

const getters = {
  getSwapRequests: (state) => {
    return state.swapRequests;
  },
};

const actions = {
  async sendSwapRequest(context, { senderId, receiverId, senderData, receiverData }) {
    try {
      socket.emit("sendSwapRequest", { senderId, receiverId, senderData, receiverData });
      socket.on("swapRequestSent", () => {
        context.dispatch("getAllSwapRequests");
      });
    } catch (error) {
      console.error("Error sending swap request:", error);
    }
  },

  async acceptSwapRequest(context, { swapRequestId, chosenSkillToSwap }) {
    try {
      socket.emit("acceptSwapRequest", { swapRequestId, chosenSkillToSwap });
      socket.on("swapRequestAccepted", () => {
        context.dispatch("getAllSwapRequests");
      });
    } catch (error) {
      console.error("Error accepting swap request:", error);
    }
  },

  async rejectSwapRequest({ dispatch }, swapRequestId) {
    try {
      socket.emit("rejectSwapRequest", { swapRequestId });
      socket.on("swapRequestRejected", () => {
        dispatch("getAllSwapRequests");
      });
    } catch (error) {
      console.error("Error rejecting swap request:", error);
    }
  },

  async deleteSwapRequest({ dispatch }, requestId) {
    try {
      socket.emit("deleteSwapRequest", { requestId });
      socket.on("swapRequestDeleted", () => {
        dispatch("getAllSwapRequests");
      });
    } catch (error) {
      console.error("Error deleting swap request:", error);
    }
  },

  async getAllSwapRequests({ commit }) {
    try {
      socket.emit("getAllSwapRequests")
      socket.on("allSwapRequests", (swapRequests) => {
        commit("setSwapRequests", swapRequests);
      });
    } catch (error) {
      console.error("Error fetching all swap requests:", error);
    }
  },
};

const mutations = {
  setSwapRequests(state, swapRequests) {
    state.swapRequests = swapRequests;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
