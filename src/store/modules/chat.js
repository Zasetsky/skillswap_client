import { getSocket } from "../../soket";
import Vue from 'vue';

const state = {
    currentChat: null,
    isBusy: false,
    chats: [],
};

const getters = {
    getCurrentChat: (state) => state.currentChat,

    getAllChats: (state) => state.chats,

    getIsBusy: (state) => state.isBusy,
};

const actions = {
  switchPartnerIsBusy({ commit }) {
    const socket = getSocket();

    socket.on("isBusy", () => {
      console.log("partner");
      commit("SET_IS_BUSY", true);
    });
  },

  createChat({ commit }, { receiverId, senderId, requestId }) {
    return new Promise((resolve, reject) => {
      const socket = getSocket();

      socket.emit("createChat", { receiverId, senderId, requestId });

      socket.on("notCreatedChat", () => {
        commit("SET_IS_BUSY", true);
        socket.emit("toggleIsBusy", requestId);
      });

      socket.once("chat", (newChat) => {
        resolve(newChat);
      });

      socket.on("error", (error) => {
        console.error("Ошибка создания чата:", error.error);
        reject(error);
      });
    });
  },
  
  listenForNewChat({ commit }) {
    try {
        const socket = getSocket();

        socket.on("newChat", (newChat) => {
          commit("ADD_CHAT", newChat);
        });
    } catch (error) {
        console.error("Error listening for new chat:", error);
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

      socket.on("message", (newMessage) => {
        context.commit("ADD_MESSAGE_TO_CHAT", newMessage);
      });
    } catch (error) {
        console.error("Error listening for New Message:", error);
    }
  },
};

const mutations = {
  ADD_MESSAGE_TO_CHAT(state, newMessage) {
    // Update state.currentChat
    if (state.currentChat && state.currentChat._id === newMessage.chatId) {
      Vue.set(state.currentChat, 'messages', [...state.currentChat.messages, newMessage]);
    }

    // Update the correct chat in state.chats
    state.chats = state.chats.map(chat => {
      if (chat._id === newMessage.chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        }
      }
      return chat;
    });
  },

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

  ADD_CHAT: (state, newChat) => {
    state.chats.push(newChat);
  },

  SET_IS_BUSY: (state, isBusy) => {
    state.isBusy = isBusy;
    console.log('isBusy:', state.isBusy);
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
