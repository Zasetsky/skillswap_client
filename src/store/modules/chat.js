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

const mutations = {
    SET_CURRENT_CHAT(state, chat) {
        state.currentChat = chat;
        localStorage.setItem("currentChat", JSON.stringify(chat));
    },
};

const actions = {
    async createChat({ commit }, { currentUserId, senderId, skillId }) {
        try {
            const response = await axios.post(`${API_URL}/create`, {
                currentUserId,
                senderId,
                skillId,
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

    async sendMessage(context, { chatId, content }) {
        try {
          const response = await axios.post(`${API_URL}/send`, {
            chatId,
            content,
          });
          // Заменить sender на объект с идентификатором пользователя
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
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
