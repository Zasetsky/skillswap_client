<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          v-for="chat in computedChats"
          :key="chat._id"
        >
          <ChatCard
            class="chat-card"
            :chat="chat"
            :is-sender="isSender(chat)"
            :is-received="isReceived(chat)"
            @open-chat="openChat"
          />
        </v-col>
        <v-col v-if="computedChats && computedChats.length === 0" class="text-center fill-height mt-10">
          <span class="text-h6">
            Здесь будут ваши начатые чаты
          </span>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AsyncComputed from "vue-async-computed";
import ChatCard from "@/components/ChatComponents/ChatCard.vue";

export default {
  components: {
    ChatCard,
},

  mixins: [AsyncComputed],

  data() {
    return {
      isLoading: true,
      computedChats: [],
    };
  },

  computed: {
    ...mapGetters("chat", ["getAllChats", "getCurrentChat"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("user", ["getUserProfile"]),
  },

  asyncComputed: {
    async computedChats() {
      this.computedChats = await this.computeChats();
      return this.computedChats;
    },
  },

  watch: {
    getAllChats: {
      handler() {
        this.computeChats();
      },
      deep: true
    },
  },

  methods: {
    ...mapActions('chat', ['fetchAllChats', 'fetchCurrentChat']),
    ...mapActions('swapRequests', ['fetchAllSwapRequests']),
    ...mapActions('user', ['fetchUserProfile']),

    async computeChats() {
      const chats = await Promise.all(
        this.getAllChats.map(async (chat) => {
          const lastSwapRequestId = chat.swapRequestIds[chat.swapRequestIds.length - 1];
          const swapRequest = this.getSwapRequests.find((sr) => sr._id === lastSwapRequestId);
          if (swapRequest) {
            const partner = await this.getPartnerName(chat);
            const { skillToLearn, skillToTeach } = this.getSkills(swapRequest);
            const { message, messageTime } = await this.getLastMessageAndTime(chat);

            return { ...chat, skillToLearn, skillToTeach, partner, message, messageTime };
          }
          return chat;
        })
      );
      this.computedChats = chats;
      return chats;
    },

    async getPartnerName(chat) {
      const partnerId = chat.participants.find(
        (participant) => participant !== this.currentUser._id
      );
      await this.fetchUserProfile(partnerId);
      const partnerProfile = this.getUserProfile;

      return partnerProfile ? `${partnerProfile.firstname} ${partnerProfile.lastname}` : '';
    },

    getSkills(swapRequest) {
      const isSender = swapRequest.senderId === this.currentUser._id;
      const skillToLearn = isSender
        ? swapRequest.receiverData.skillsToLearn[0]
        : swapRequest.senderData.skillsToLearn[0];
      const skillToTeach = isSender
        ? swapRequest.senderData.skillsToTeach[0]
        : swapRequest.receiverData.skillsToTeach[0];

      return { skillToLearn, skillToTeach };
    },

    async getLastMessageAndTime(chat) {
      const lastMessage = chat.messages.slice(-1)[0];
      const message = lastMessage ? lastMessage.content : '';
      const messageTime = lastMessage
        ? new Date(lastMessage.createdAt).toLocaleTimeString('RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      return { message, messageTime };
    },

    isReceived(chat) {
      const lastSwapRequestId = chat.swapRequestIds[chat.swapRequestIds.length - 1];
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === lastSwapRequestId
      );
      return swapRequest ? swapRequest.receiverId === this.currentUser._id : false;
    },

    isSender(chat) {
      const lastSwapRequestId = chat.swapRequestIds[chat.swapRequestIds.length - 1];
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === lastSwapRequestId
      );
      return swapRequest ? swapRequest.senderId === this.currentUser._id : false;
    },

    async openChat(chatId) {
      try {
        await this.fetchCurrentChat(chatId);

        this.$router.push({
          name: 'Chat',
          query: { chatId },
        });
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    },
  },

  async created() {
    this.isLoading = true;
    try {
      await this.fetchAllChats();
      await this.fetchAllSwapRequests();
    } catch (error) {
      console.error("Error getting all chats:", error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
<style scoped>
.chat-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>