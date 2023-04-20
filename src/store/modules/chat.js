import axios from "axios";

const API_URL = 'http://localhost:3000/api/chat'; 

const state = {
    currentChat: null,
    socket: null,
    chats: [],
};

const getters = {
    getCurrentChat: (state) => state.currentChat,
};

const actions = {
  setSocket({ commit }, socket) {
    commit('SET_SOCKET', socket);
  },

  async createChat({ commit }, { currentUserId, senderId, swapRequestId }) {
    try {
      const response = await axios.post(`${API_URL}/create`, { currentUserId, senderId, swapRequestId });
      commit("SET_CURRENT_CHAT", response.data.chat);
      return response.data.chat;
    } catch (error) {
      console.error("Ошибка создания чата:", error);
      throw error;
    }
  },
  

  fetchCurrentChat({ commit, state }, chatId) {
    if (!chatId) return;
  
    state.socket.emit("fetchCurrentChat", { chatId });
  
    state.socket.on("chat", (chat) => {
      commit("SET_CURRENT_CHAT", chat);
    });
  
    state.socket.on("error", (error) => {
      console.error("Error getting chat:", error);
    });
  },

  fetchAllChats({ commit, state }) {
    if (!state.socket) {
      console.error('Socket not connected');
      return;
    }

    state.socket.emit("fetchAllChats");

    state.socket.on("allChats", (chats) => {
      commit("SET_ALL_CHATS", chats);
    });

    state.socket.on("error", (error) => {
      console.error("Error getting all chats:", error.message);
    });
  },

  async sendMessage({ commit, state }, { chatId, type, content, sender }) {
    try {
      if (!state.socket) {
        throw new Error("Сокет не инициализирован");
      }
      const newMessage = {
        chatId,
        type: type || "text",
        content,
        sender
      };
      state.socket.emit("sendMessage", newMessage);
      commit("ADD_MESSAGE_TO_CHAT", { chatId, message: newMessage });
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      throw error;
    }
  },

  addMessageToChat({ commit }, { chatId, message }) {
      commit("ADD_MESSAGE_TO_CHAT", { chatId, message });
  },

  updateDeal({ commit, state }, { chatId, status, senderId, formData1, formData2 }) {
    const socket = state.socket;

    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    const data = { chatId, status, senderId, formData1, formData2 };

    socket.emit("updateDeal", data);

    socket.on("deal", (updatedDeal) => {
      commit("UPDATE_DEAL", { chatId, deal: updatedDeal });
    });

    socket.on("error", (error) => {
      console.error("Error updating deal:", error.message);
    });
  },
};

const mutations = {
  SET_SOCKET: (state, socket) => {
    state.socket = socket;
  },

  ADD_MESSAGE_TO_CHAT(state, { chatId, message }) {
    if (state.currentChat && state.currentChat._id === chatId) {
      state.currentChat.messages.push(message);
    }
  },

  SET_CURRENT_CHAT: (state, chat) => {
    state.currentChat = chat;
  },

  SET_ALL_CHATS: (state, chats) => {
    state.chats = chats;
  },

  UPDATE_DEAL(state, { chatId, deal }) {
    const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
    if (chatIndex !== -1) {
      state.chats[chatIndex].deal = deal;
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
