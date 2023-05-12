import { getSocket } from "../../soket";

const state = {
  swapRequests: [],
  currentSwapRequest: null,
};

const getters = {
  getSwapRequests: (state) => {
    return state.swapRequests;
  },
  getCurrentSwapRequest: (state) => {
    return state.currentSwapRequest;
  }
};

const actions = {
  async sendSwapRequest(context, { senderId, receiverId, senderData, receiverData }) {
    try {
      const socket = getSocket();

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
      const socket = getSocket();

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
      const socket = getSocket();

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
      const socket = getSocket();

      socket.emit("deleteSwapRequest", { requestId });
      socket.on("swapRequestDeleted", () => {
        dispatch("getAllSwapRequests");
      });
    } catch (error) {
      console.error("Error deleting swap request:", error);
    }
  },

  async getAllSwapRequests({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        const socket = getSocket();

        socket.emit("getAllSwapRequests");
        socket.on("allSwapRequests", (swapRequests) => {
          commit("setSwapRequests", swapRequests);
          resolve(swapRequests);
        });
      } catch (error) {
        console.error("Error fetching all swap requests:", error);
        reject(error);
      }
    });
  },

  async getCurrentSwapRequest({ commit }, swapRequestId) {
    return new Promise((resolve, reject) => {
      try {
        const socket = getSocket();

        socket.emit("getCurrentSwapRequest", { swapRequestId });
        socket.once("currentSwapRequest", (swapRequest) => {
          commit("setCurrentSwapRequest", swapRequest);
          resolve(swapRequest);
        });
      } catch (error) {
        console.error("Error fetching all swap requests:", error);
        reject(error);
      }
    });
  },

  listenForSwapRequestUpdates({ commit }) {
    const socket = getSocket();

    socket.on("swapRequestUpdated", (updatedSwapRequest) => {
      commit("updateSwapRequest", updatedSwapRequest);
    });
  },
};

const mutations = {
  setSwapRequests(state, swapRequests) {
    state.swapRequests = swapRequests;
  },
  setCurrentSwapRequest(state, swapRequest) {
    state.currentSwapRequest = swapRequest;
  },
  updateSwapRequest(state, updatedSwapRequest) {
    const index = state.swapRequests.findIndex((request) => request._id === updatedSwapRequest._id);

    if (index !== -1) {
      state.swapRequests.splice(index, 1, updatedSwapRequest);
    } else {
      console.warn("Swap request to update not found in state");
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
