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
      const chats = await Promise.all(
        this.getAllChats.map(async (chat) => {
          const swapRequest = this.getSwapRequests.find(
            (sr) => sr._id === chat.swapRequestId
          );
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
  },

  async created() {
    try {
      await this.fetchAllChats();
      await this.getAllSwapRequests();
    } catch (error) {
      console.error("Error getting all chats:", error);
    }
  },

  methods: {
    ...mapActions('chat', ['fetchAllChats']),
    ...mapActions('swapRequests', ['getAllSwapRequests']),
    ...mapActions('user', ['fetchUserProfile']),

    async getPartnerName(chat) {
      const partnerId = chat.participants.find(
        (participant) => participant !== this.currentUser._id
      );
      await this.fetchUserProfile(partnerId);
      const partnerProfile = this.getUserProfile;

      return partnerProfile ? `${partnerProfile.firstName} ${partnerProfile.lastName}` : '';
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
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === chat.swapRequestId
      );
      return swapRequest ? swapRequest.receiverId === this.currentUser._id : false;
    },

    isSender(chat) {
      const swapRequest = this.getSwapRequests.find(
        (sr) => sr._id === chat.swapRequestId
      );
      return swapRequest ? swapRequest.senderId === this.currentUser._id : false;
    },

    async openChat(receiverId, requestId) {
      try {
        // Создайте чат, если его еще не существует
        await this.$store.dispatch('chat/createOrGetCurrentChat', {
          receiverId: receiverId,
          senderId: this.currentUser._id,
          swapRequestId: requestId,
        });

        // Получите текущий чат, возможно, используя внутренний метод
        const chat = this.getCurrentChat;

        // Check if chat is defined
        if (!chat) {
          console.error("Chat not found");
          return;
        }

        // Создайте или получите текущую сделку
        await this.$store.dispatch('deal/createOrGetCurrentDeal', {
          participants: chat.participants,
          chatId: chat._id,
          swapRequestId: chat.swapRequestId,
        });

        // Сохраните chatId в локальное хранилище
        localStorage.setItem("chatId", chat._id);

        // Перейдите к странице чата с использованием роутера
        this.$router.push(`/${chat._id}`);
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    },

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
