import axios from "axios";

const API_URL = 'http://localhost:3000/api/chat'; 

const state = {
    currentChat: JSON.parse(localStorage.getItem("currentChat") || "{}"),
};

const getters = {
    getCurrentChat: (state) => {
        return state.currentChat;
    },
};

const actions = {
    async createChat({ commit }, { currentUserId, senderId, swapRequestId }) {
        try {
            const response = await axios.post(`${API_URL}/create`, {
                currentUserId,
                senderId,
                swapRequestId,
            });
            commit('SET_CURRENT_CHAT', response.data.chat);
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    },

    async getMessages({ commit }, chatId) {
        if (!chatId) return;

        try {
            const response = await axios.get(`${API_URL}/messages/${chatId}`);
            commit('SET_CURRENT_CHAT', response.data.chat);
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    async sendMessage(context, { chatId, type, content }) {
        try {
          const response = await axios.post(`${API_URL}/send`, {
            chatId,
            type: type || 'text',
            content,
          });
      
          const messageWithSenderObject = {
            ...response.data.message,
            sender: { _id: response.data.message.sender },
          };
      
          return messageWithSenderObject;
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
    },

    async updateDeal({ commit }, { chatId, status, senderId, formData1, formData2 }) {
        try {
            const response = await axios.patch(`${API_URL}/deal/update/${chatId}`, {
                status,
                senderId,
                formData1,
                formData2,
            });
            const updatedDeal = response.data;
            commit("UPDATE_DEAL", updatedDeal);
            return updatedDeal;
        } catch (error) {
            console.error("Error updating deal:", error);
            throw error;
        }
    },

    async confirmDeal({ commit }, { chatId }) {
        try {
          const response = await axios.patch(`${API_URL}/deal/confirm/${chatId}`);
          const updatedDeal = response.data.deal;
          commit('UPDATE_DEAL', updatedDeal);
          return response.data.zoomMeeting;
        } catch (error) {
          console.error("Error confirming deal:", error);
          throw error;
        }
    },
};

const mutations = {
    SET_CURRENT_CHAT(state, chat) {
        state.currentChat = chat;
        localStorage.setItem("currentChat", JSON.stringify(chat));
    },

    UPDATE_DEAL(state, updatedDeal) {
        if (state.currentChat._id === updatedDeal.chatId) {
            state.currentChat.deal = updatedDeal.deal;
            localStorage.setItem("currentChat", JSON.stringify(state.currentChat));
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
