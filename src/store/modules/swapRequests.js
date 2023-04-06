import axios from "axios";

const API_URL = "http://localhost:3000/api/swap-requests/";

const actions = {
    async sendSwapRequest(context, { senderData, receiverData }) {
        try {
            await axios.post(API_URL + "send", { receiverId: receiverData.id, senderData, receiverData }, {
                headers: {
                },
            });
        } catch (error) {
            console.error("Error sending swap request:", error);
        }
    },

  async updateSwapRequestStatus(context, { requestId, newStatus }) {
    try {
      await axios.put(API_URL + `${requestId}`, { status: newStatus });
    } catch (error) {
      console.error("Error updating swap request status:", error);
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
