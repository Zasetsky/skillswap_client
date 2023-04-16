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
      <DealFormComponent ref="dealForm" :deal="getCurrentChat.deal" @submit-deal-form="handleDealFormSubmit" @confirm-deal="confirmDeal" />
      <MessageForm @send-message="sendMessage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
      return this.getCurrentChat.messages || [];
    },
  },

  methods: {
    ...mapActions('chat', ['getMessages', 'updateDeal']),

    addMessageToLocalChat(newMessage) {
      this.getCurrentChat.messages.push(newMessage);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      const messagesContainer = this.$refs.messagesContainer;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    async sendMessage(type, content) {
      const newMessage = await this.$store.dispatch('chat/sendMessage', {
        chatId: this.getCurrentChat._id,
        type,
        content,
      });
      this.addMessageToLocalChat(newMessage);
    },

    async handleDealFormSubmit({ formData1, formData2 }) {
      const updatedDeal = await this.$store.dispatch("chat/updateDeal", {
        chatId: this.getCurrentChat._id,
        status: 'pending',
        senderId: this.currentUser._id,
        formData1,
        formData2,
      });

      this.getCurrentChat.deal = updatedDeal;

      await this.sendMessage("deal_proposal");
    },
    
    handleOpenDealForm() {
      this.$refs.dealForm.dialog = true;
    },

    async confirmDeal() {
      try {
        const updatedDeal = await this.$store.dispatch("chat/confirmDeal", {
          chatId: this.getCurrentChat._id,
        });

        // Отправка ссылки на встречу и пароля в чат
        await this.sendMessage("meeting_details", {
          meetingLink: updatedDeal.join_url,
          password: updatedDeal.password,
        });
      } catch (error) {
        console.error("Error confirming deal:", error);
      }
    },
  },

  watch: {
    messages(newVal, oldVal) {
      if (newVal.length > oldVal.length) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
  },

  mounted() {
    console.log(this.getCurrentChat);
    this.getMessages(this.getCurrentChat._id);
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
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
