<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <MessageComponent
        v-for="message in messages"
        :key="message._id"
        :message="message"
        :allMessages="messages"
        :currentUserId="currentUser._id"
        @open-deal-form="handleOpenDealForm"
      />
    </div>
    <div class="bottom-bar">
      <DealFormComponent
        ref="dealForm"
        :deal="getCurrentChat?.deal || null"
        @submit-deal-form="handleDealFormSubmit"
        @confirm-deal="confirmDeal"
      />
      <MessageForm @send-message="sendMessage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MessageComponent from '@/components/ChatComponents/MessageComponent.vue';
import MessageForm from '@/components/ChatComponents/MessageFormComponent.vue';
import DealFormComponent from '@/components/ChatComponents/DealFormComponent.vue';

export default {
  components: {
    MessageComponent,
    MessageForm,
    DealFormComponent,
  },

  computed: {
    ...mapGetters('chat', ['getCurrentChat']),
    ...mapGetters('auth', ['currentUser']),
    messages() {
      return this.$store.state.chat.currentChat
        ? this.$store.state.chat.currentChat.messages
        : [];
    },
  },

  methods: {
    async addMessageToLocalChat(newMessage) {
      await this.$store.dispatch("chat/addMessageToChat", {
        chatId: this.getCurrentChat._id,
        message: newMessage,
      });
      this.scrollToBottom();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    },

    async sendMessage(type, content) {
      try {
        const newMessage = {
          chatId: this.getCurrentChat._id,
          type: type || 'text',
          content,
          sender: this.currentUser._id
        };

        await this.$store.dispatch("chat/sendMessage", newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    async handleDealFormSubmit({ formData1, formData2 }) {
      await this.$store.dispatch("chat/updateDeal", {
        chatId: this.getCurrentChat._id,
        status: 'pending',
        senderId: this.currentUser._id,
        formData1,
        formData2,
      });

      await this.sendMessage("deal_proposal", " ");
    },

    handleOpenDealForm() {
      this.$refs.dealForm.dialog = true;
    },

    async confirmDeal() {
      try {
        await this.$store.dispatch("chat/confirmDeal", {
          chatId: this.getCurrentChat._id,
        });

      } catch (error) {
        console.error("Error confirming deal:", error);
      }
    },
  },

  watch: {
    messages(newVal, oldVal) {
      if (newVal.length > oldVal.length) {
        this.scrollToBottom();
      }
    },
  },

  async mounted() {
    try {
      const chatId = localStorage.getItem("chatId");
      await this.$store.dispatch("chat/fetchCurrentChat", chatId);

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    } catch (error) {
      console.error("Error in mounted lifecycle hook:", error);
    }
  }
};

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px;
  height: 400px;
  max-height: 100%;
}

.bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}
</style>

