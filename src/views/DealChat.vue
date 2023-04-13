<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <MessageComponent
        v-for="message in messages"
        :key="message._id"
        :message="message"
        :currentUserId="currentUser._id"
      />
    </div>
    <div class="bottom-bar">
      <MessageForm @send-message="sendMessage" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MessageComponent from '@/components/ChatComponents/MessageComponent.vue';
import MessageForm from '@/components/ChatComponents/MessageFormComponent.vue';

export default {
  components: {
    MessageComponent,
    MessageForm,
  },

  computed: {
    ...mapGetters('chat', ['getCurrentChat']),
    ...mapGetters('auth', ['currentUser']),
    messages() {
      return this.getCurrentChat.messages || [];
    },
  },

  methods: {
    ...mapActions('chat', ['getMessages', 'sendMessage']),

    addMessageToLocalChat(newMessage) {
      console.log('addMessageToLocalChat', newMessage);
      this.getCurrentChat.messages.push(newMessage);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      console.log('scrollToBottom');
      console.log('messagesContainer height:', this.$refs.messagesContainer.offsetHeight);
      console.log('messagesContainer scrollHeight:', this.$refs.messagesContainer.scrollHeight);
      const messagesContainer = this.$refs.messagesContainer;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    async sendMessage(content) {
      const newMessage = await this.$store.dispatch('chat/sendMessage', {
        chatId: this.getCurrentChat._id,
        content,
      });
      this.addMessageToLocalChat(newMessage);
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
