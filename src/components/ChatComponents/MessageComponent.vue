<template>
  <div class="message-container" :class="{'my-message': isMyMessage, 'other-message': !isMyMessage}">
    <v-card class="message-card mb-2">
      <v-card-text>
        <template v-if="message.type === 'text'">
          {{ message.content }}
        </template>
        <template v-else-if="message.type === 'deal_proposal'">
          Предложены параметры сделки: 
          <v-btn v-if="isLastDealProposal" color="primary" small @click="openDealForm">Открыть</v-btn>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },

    currentUserId: {
      type: String,
      required: true,
    },

    allMessages: {
      type: Array,
      required: true,
    },
  },

  computed: {
    isMyMessage() {
      return this.message.sender._id === this.currentUserId;
    },

    isLastDealProposal() {
      const lastDealProposal = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'deal_proposal');
      return this.message._id === lastDealProposal._id;
    },
  },

  methods: {
    openDealForm() {
      this.$emit('open-deal-form', this.message.content);
    }
  }
};
</script>

<style scoped>
.message-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.message-card {
  display: inline-block;
  max-width: 50%;
  text-align: left;
  background-color: #ffffff;
  border-radius: 7px;
}

.my-message {
  align-items: flex-end;
  margin-left: -16px;
  margin-bottom: 8px;
  margin-top: 16px;
}

.other-message {
  align-self: flex-start;
  margin-left: 16px;
  margin-bottom: 8px;
  margin-top: 16px;
}

/* Стилизация моих сообщений */
.my-message .message-card {
  background-color: #DCF8C6;
  border-radius: 7px 7px 0px 7px;
}

/* Стилизация сообщений других пользователей */
.other-message .message-card {
  background-color: #ffffff;
  border-radius: 7px 7px 7px 0px;
}
</style>


