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
      <DealFormComponent ref="dealForm" :deal="getCurrentChat.deal" @submit-deal-form="handleDealFormSubmit" />
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

    async sendMessage(content) {
      console.log('chat: ', this.getCurrentChat);

      const newMessage = await this.$store.dispatch('chat/sendMessage', {
        chatId: this.getCurrentChat._id,
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
      console.log(updatedDeal);
      this.getCurrentChat.deal = updatedDeal;

      await this.sendMessage({
          type: 'deal_proposal',
      });
  },
    
    handleOpenDealForm() {
      this.$refs.dealForm.dialog = true;
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
