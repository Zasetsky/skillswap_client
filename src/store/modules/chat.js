import { getSocket } from "../../soket";

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

  async createChat({ commit }, { receiverId, senderId, swapRequestId }) {
    return new Promise((resolve, reject) => {
      try {
        const socket = getSocket();

        socket.on("chat", (chat) => {
          commit("SET_CURRENT_CHAT", chat);
          resolve();
        });
  
        socket.on("error", (error) => {
          console.error("Ошибка создания чата:", error);
          reject(error);
        });
  
        socket.emit("createChat", { receiverId, senderId, swapRequestId });
      } catch (error) {
        console.error("Ошибка создания чата:", error);
        reject(error);
      }
    });
  },  
  

  fetchCurrentChat({ commit }, chatId) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();

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
    const socket = getSocket();

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
      const socket = getSocket();

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
