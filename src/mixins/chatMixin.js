export default {
  methods: {
    async createChat(receiverId, senderId, requestId) {
      try {
        const newChat = await this.$store.dispatch("chat/createChat", {
          receiverId,
          senderId,
          requestId,
        });
        return newChat;
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },
    
    async createDeal(receiverId, senderId, requestId, chatId) {
      try {
        await this.$store.dispatch("deal/createDeal", {
          participants: [receiverId, senderId],
          chatId,
          requestId,
        });
      } catch (error) {
        console.error("Error creating deal:", error);
      }
    },
    
    async openOrCreateChat(receiverId, senderId, requestId, chatId, status) {
      if (status === 'rejected' || status === 'pending') {
        return;
      }
  
      let store = this.$store;
      let isBusy = store.getters["chat/getIsBusy"];
  
      if (isBusy && !chatId) {
        console.log('Is BUSY!!!');
        return;
      }
  
      let localChatId;
      if (!chatId) {
        let newChat = await this.createChat(receiverId, senderId, requestId);
        localChatId = newChat._id;
  
        await this.createDeal(receiverId, senderId, requestId, localChatId);
      } else {
        await this.$store.dispatch("chat/fetchCurrentChat", chatId);
        localChatId = chatId;
      }
      
  
      this.$router.push({
        name: 'Chat',
        query: { chatId: localChatId },
      });
    },
  },
};
