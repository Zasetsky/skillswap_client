<template>
  <div class="message-container" :class="{'my-message': isMyMessage, 'other-message': !isMyMessage}">
    <v-card class="message-card mb-2">
      <v-card-text>
        <template v-if="message.type === 'text'">
          {{ message.content }}
        </template>
        <template v-else-if="message.type === 'deal_proposal'">
          Предложены параметры сделки: 
          <v-btn v-if="isLastDealProposal && !hasMeetingDetails && !hasCancellationRequest" color="primary" small @click="openDealForm">Открыть</v-btn>
        </template>
        <template v-else-if="message.type === 'reschedule_proposal'">
          Предложены параметры переноса сделки: 
          <v-btn v-if="isLastRescheduleProposal && !hasCancellationRequest" color="primary" small @click="openDealForm">Открыть</v-btn>
        </template>
        <template v-else-if="message.type === 'meeting_details'">
          Ссылка: <b><a :href="message.content.meetingLink" target="_blank">{{ message.content.meetingLink }}</a></b><br>
          Пароль: <b>{{ message.content.password }}</b><br>
          Дата встречи: <b>{{ message.content.meetingDate }}</b><br>
          Время встречи: <b>{{ message.content.meetingTime }}</b><br>
          Продолжительность встречи: <b>{{ message.content.meetingDuration }}</b>
        </template>
        <template v-else-if="message.type === 'cancellation_request'">
          <b>Запрос на отмену сделки:</b>
          <br><b>Причина:</b> {{ message.content.reason }}<br>
          <v-btn v-if="!isMyMessage" color="success" small @click="$emit('approve-cancellation')">Подтвердить</v-btn>
          <v-btn v-if="!isMyMessage" color="error" small @click="$emit('reject-cancellation')">Отклонить</v-btn>
          <br>
          <span v-if="!isMyMessage" style="color: red;">Если вы не примете решение в течение 24 часов, ваша карма подпортится, и сделка всё равно будет отменена.</span>
          <span v-if="isMyMessage" style="color: red;">Если пользователь не примет решение в течение 24 часов, сделка всё равно будет отменена.</span>
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
      return this.message.sender === this.currentUserId;
    },

    hasMeetingDetails() {
      return this.allMessages.some(msg => msg.type === 'meeting_details');
    },

    hasCancellationRequest() {
      return this.allMessages.some(msg => msg.type === 'cancellation_request');
    },

    isLastRescheduleProposal() {
      const lastRescheduleProposal = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'reschedule_proposal');
      return this.message._id === lastRescheduleProposal._id;
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
  },
  mounted() {
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


