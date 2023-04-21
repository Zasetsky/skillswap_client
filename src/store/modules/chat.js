import io from "socket.io-client";

const API_URL = 'http://localhost:3000/'; 
const socket = io(API_URL);

const state = {
    currentChat: null,
    chats: [],
};

const getters = {
    getCurrentChat: (state) => state.currentChat,

    getAllChats: (state) => state.chats
};

const actions = {
  setSocket({ commit }, socket) {
    commit('SET_SOCKET', socket);
  },

  async createChat({ commit }, { currentUserId, senderId, swapRequestId }) {
    return new Promise((resolve, reject) => {
      try {
        socket.on("chat", (chat) => {
          console.log(chat);
          commit("SET_CURRENT_CHAT", chat);
          resolve();
        });
  
        socket.on("error", (error) => {
          console.error("Ошибка создания чата:", error);
          reject(error);
        });
  
        socket.emit("createChat", { currentUserId, senderId, swapRequestId });
      } catch (error) {
        console.error("Ошибка создания чата:", error);
        reject(error);
      }
    });
  },  
  

  fetchCurrentChat({ commit }, chatId) {
    return new Promise((resolve, reject) => {
      if (!chatId) {
        reject("Chat ID is undefined or null");
        return;
      }
      socket.emit("fetchCurrentChat", { chatId });
      socket.on("chat", (chat) => {
        commit("SET_CURRENT_CHAT", chat);
        resolve(chat);
      });
      socket.on("error", (error) => {
        console.error("Error getting chat:", error);
        reject(error);
      });
    });
  },

  fetchAllChats({ commit }) {
    if (!socket) {
      console.error('Socket not connected');
      return;
    }

    socket.emit("fetchAllChats");

    socket.on("allChats", (chats) => {
      commit("SET_ALL_CHATS", chats);
    });

    socket.on("error", (error) => {
      console.error("Error getting all chats:", error.message);
    });
  },

  async sendMessage({ dispatch }, { chatId, type, content, sender }) {
    try {
      if (!socket) {
        throw new Error("Сокет не инициализирован");
      }
      const newMessage = {
        chatId,
        type: type || "text",
        content,
        sender
      };
      socket.emit("sendMessage", newMessage);

      socket.on("message", (chatId) => {
        dispatch("fetchCurrentChat", chatId);
      });
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      throw error;
    }
  },

  updateDeal({ commit }, { chatId, status, senderId, formData1, formData2 }) {
    const socket = socket;

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
