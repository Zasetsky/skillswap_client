import axios from "axios";

const API_URL = "http://localhost:3000/api/swap-requests/";

const actions = {
  async sendSwapRequest(context, { senderData, receiverData }) {
      try {
        console.log('id: ', receiverData.id);
          await axios.post(API_URL + "send", { receiverId: receiverData.id, senderData, receiverData });
      } catch (error) {
          console.error("Error sending swap request:", error);
      }
  },

  async acceptSwapRequest(context, { currentUserId, requestId, userId, skillToTeach }) {
    try {
      await axios.post(API_URL + "accept", { currentUserId, requestId, userId, skillToTeach });
    } catch (error) {
      console.error("Error accepting swap request:", error);
    }
  },

  async rejectSwapRequest(context, swapRequestId) {
    try {
      await axios.put(API_URL + `reject/${swapRequestId}`);
    } catch (error) {
      console.error("Error rejecting swap request:", error);
    }
  },

  async deleteSwapRequest(context, requestId) {
    try {
      await axios.delete(API_URL + `${requestId}`);
    } catch (error) {
      console.error("Error deleting swap request:", error);
    }
  },
};

export default {
  namespaced: true,
  actions,
};
