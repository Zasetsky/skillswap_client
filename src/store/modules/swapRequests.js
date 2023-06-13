import { getSocket } from "../../soket";

const state = {
  swapRequests: [],
  currentSwapRequest: null,
  filterSkillId: null,
};

const getters = {
  getSwapRequests: (state) => {
    return state.swapRequests;
  },

  filteredSwapRequests: (state) => {
    if (!state.swapRequests || state.swapRequests.length === 0 || !state.filterSkillId) {
      return [];
    }

    return state.swapRequests.filter((request) => {
      return (
        (request.receiverData.skillsToLearn.some((skill) => skill._id === state.filterSkillId) ||
        request.receiverData.skillsToTeach.some((skill) => skill._id === state.filterSkillId)) &&
        (request.status === "accepted")
      );
    });
  },

  getCurrentSwapRequest: (state) => {
    return state.currentSwapRequest;
  },
};

const actions = {
  sendSwapRequest(context, { senderId, receiverId, senderData, receiverData }) {
    try {
        const socket = getSocket();

        socket.emit("sendSwapRequest", { senderId, receiverId, senderData, receiverData });

    } catch (error) {
        console.error("Error sending swap request:", error);
    }
  },

  listenForSwapRequestSent({ commit }) {
    try {
      const socket = getSocket();

      socket.on("swapRequestSent", (newSwapRequest) => {
        commit("addSwapRequest", newSwapRequest);
      });
    } catch (error) {
      console.error("Error listening for swap requests:", error);
    }
  },

  acceptSwapRequest(context, { swapRequestId, chosenSkill }) {
    try {
      const socket = getSocket();
      console.log(chosenSkill);
      socket.emit("acceptSwapRequest", { swapRequestId, chosenSkill });

    } catch (error) {
      console.error("Error accepting swap request:", error);
    }
  },

  listenForSwapRequestAccepted({ dispatch }) {
    try {
        const socket = getSocket();

        socket.on("swapRequestAccepted", (data) => {
          console.log(data.message);
          dispatch("fetchAllSwapRequests");

          dispatch("user/fetchCurrentUser", null, { root: true });
        });
    } catch (error) {
        console.error("Error listening for swap requests:", error);
    }
  },

  rejectSwapRequest(context , swapRequestId) {
    try {
      const socket = getSocket();

      socket.emit("rejectSwapRequest", { swapRequestId });

    } catch (error) {
      console.error("Error rejecting swap request:", error);
    }
  },

  listenForSwapRequestRejected(context) {
    try {
        const socket = getSocket();

        socket.on("swapRequestRejected", () => {
          context.dispatch("fetchAllSwapRequests");
        });
    } catch (error) {
        console.error("Error listening for swap requests:", error);
    }
  },

  deleteSwapRequest(context , requestId) {
    try {
      const socket = getSocket();

      socket.emit("deleteSwapRequest", { requestId });

    } catch (error) {
      console.error("Error deleting swap request:", error);
    }
  },

  listenForSwapRequestDeleted(context) {
    try {
        const socket = getSocket();

        socket.on("swapRequestDeleted", (data) => {
          console.log(data.message);
          context.dispatch("fetchAllSwapRequests");
        });

        socket.on("pendingSwapRequestsDeleted", (data) => {
          console.log(data.message);
          context.dispatch("fetchAllSwapRequests");
        });
    } catch (error) {
        console.error("Error listening for swap requests:", error);
    }
  },

  fetchAllSwapRequests({ commit }) {
      try {
        const socket = getSocket();
        socket.emit("getAllSwapRequests");
        socket.on("allSwapRequests", (swapRequests) => {
          commit("setSwapRequests", swapRequests);
        });
      } catch (error) {
        console.error("Error fetching all swap requests:", error);
      }
  },

  fetchCurrentSwapRequest({ commit }, swapRequestId) {
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

  listenForSwapRequestUpdates({ commit, rootState }) {
    const socket = getSocket();
  
    socket.on("swapRequestUpdated", (updatedSwapRequest) => {
      if (rootState.route.name === 'WeakSkillsPage' || rootState.route.name === 'StrongSkillsPage') {
        commit("updateSwapRequest", updatedSwapRequest);
        console.log("newChat");
        commit("chat/SET_IS_BUSY", false, { root: true });
      } else {
        commit("setCurrentSwapRequest", updatedSwapRequest);
        commit("chat/SET_IS_BUSY", false, { root: true });
      }
    });
  },
};

const mutations = {
  setSwapRequests(state, swapRequests) {
    state.swapRequests = swapRequests;
  },

  setFilterSkillId(state, id) {
    state.filterSkillId = id;
  },

  setCurrentSwapRequest(state, swapRequest) {
    state.currentSwapRequest = swapRequest;
  },

  addSwapRequest(state, newSwapRequest) {
    state.swapRequests = [newSwapRequest, ...state.swapRequests];
  },

  updateSwapRequest(state, updatedSwapRequest) {
    const index = state.swapRequests.findIndex((request) => request._id === updatedSwapRequest._id);

    if (index !== -1) {
      state.swapRequests.splice(index, 1, updatedSwapRequest);
    } else {
      console.warn("Swap request to update not found in state");
    }
  },

  logout(state) {
    state.swapRequests = [];
    state.currentSwapRequest = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
