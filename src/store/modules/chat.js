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

  createOrGetCurrentChat({ commit }, { receiverId, senderId, swapRequestId }) {
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
  
        socket.emit("createOrGetCurrentChat", { receiverId, senderId, swapRequestId });
      } catch (error) {
        console.error("Ошибка создания чата:", error);
        reject(error);
      }
    });
  },  
  
  listenForNewChat(context) {
    try {
        const socket = getSocket();

        socket.on("newChat", (newChat) => {
          context.commit("SET_ALL_CHATS", newChat);
        });
    } catch (error) {
        console.error("Error listening for swap requests:", error);
    }
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

        if (state.chats.length) {
          commit("UPDATE_CHAT", chat);
        }

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

  async sendMessage(context, { chatId, type, content }) {
    try {
      const socket = getSocket();

      if (!socket) {
        throw new Error("Сокет не инициализирован");
      }
      const newMessage = {
        chatId,
        type: type || "text",
        content,
      };
      socket.emit("sendMessage", newMessage);

    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      throw error;
    }
  },

  listenForNewMessage(context) {
    try {
        const socket = getSocket();

        socket.on("message", (chatId) => {
          context.dispatch("fetchCurrentChat", chatId);
        });
    } catch (error) {
        console.error("Error listening for swap requests:", error);
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

  UPDATE_CHAT(state, updatedChat) {
    state.chats = state.chats.map(chat =>
      chat._id === updatedChat._id ? updatedChat : chat
    );
  },

  logout(state) {
    state.currentChat = null;
    state.chats = [];
  },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
