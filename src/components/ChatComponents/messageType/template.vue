что то не так. проверь то что ты мне написал для каждого компонента типа сообщений и вот рабочий старый компонент ещё без разделений:
<template>
  <div class="message-container" :class="{'my-message': isMyMessage, 'other-message': !isMyMessage}">
    <v-card class="message-card mb-2">
      <v-card-text>
        <template v-if="message.type === 'text'">
          {{ message.content }}
        </template>
        <template v-else-if="message.type === 'details'">
          <b v-if="!isMyMessage && isLastMessage">{{ message.content }}</b>
          <span v-else-if="!isMyMessage">{{ message.content }}</span>
          <b v-if="isMyMessage && isLastMessage">Вы отвергли предложение о продолжении</b>
          <span v-else-if="isMyMessage">Вы отвергли предложение о продолжении</span>
        </template>
        <template v-else-if="message.type === 'deal_proposal'">
          <b v-if="(!isMyMessage && isLastDealProposal && !hasMeetingDetails) || (!isMyMessage && isLastDealProposal && isLastMessage)">Вам предложены параметры сделки</b>
          <span v-else-if="!isMyMessage">Вам предложены параметры сделки</span>
          <b v-if="(isMyMessage && isLastDealProposal && !hasMeetingDetails) || (isMyMessage && isLastDealProposal && isLastMessage)">Вы предложили параметры сделки</b>
          <span v-else-if="isMyMessage">Вы предложили параметры сделки</span>
          <v-btn v-if="
            !isMyMessage &&
            isLastDealProposal &&
            !hasMeetingDetails &&
            !hasCancellationRequest &&
            !hasContinuationRequest"
            color="primary"
            small
            @click="openDealForm"
          >
            Открыть
          </v-btn>
        </template>
        <template v-else-if="message.type === 'reschedule_proposal'">
          <p v-if="!isMyMessage">Вам предложены параметры переноса сделки:</p>
          <b v-else>Вы предложили перенос.</b>
          <v-btn v-if="
            !isMyMessage &&
            isLastRescheduleProposal &&
            !hasCancellationRequest &&
            !hasContinuationRequest"
            color="primary"
            small
            @click="openDealForm"
          >
            Открыть
          </v-btn>
        </template>
        <template v-else-if="message.type === 'meeting_details'">
          Навык: <b>{{ message.content.skill }}</b><br><br>
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
        <template v-else-if="message.type === 'continuation_request'">
          <b v-if="isMyMessage && isLastContinuationRequest && isLastMessage">Вы отправили запрос на продолжение сделки</b>
          <span v-else-if="isMyMessage">Вы отправили запрос на продолжение сделки</span>
          
          <b v-if="!isMyMessage && isLastContinuationRequest && getCurrentDeal.continuation.status === 'true'">{{ getUserProfile.firstname }} предлагает продолжить</b>
          <span v-else-if="!isMyMessage && !isLastMessage">{{ getUserProfile.firstname }} предложил продолжить</span>
          
          <span v-if="!isMyMessage && getCurrentDeal.continuation.status === 'approved'">Вы согласились на продолжение сделки.</span>
          
          <v-btn v-if="!isMyMessage && hasContinuationRequest && isLastContinuationRequest" color="success" small @click="$emit('approve-continuation')">Подтвердить</v-btn>
          <v-btn v-if="!isMyMessage && hasContinuationRequest && isLastContinuationRequest" color="error" small @click="$emit('reject-continuation')">Отклонить</v-btn>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },

    allMessages: {
      type: Array,
      required: true,
    },
  },

  computed: {
    ...mapGetters('deal', ['getCurrentDeal']),
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('user', ['getUserProfile']),

    messageClass() {
    let messageClass = 'normal';
    if (this.message.type === 'details' && (!this.isMyMessage && this.isLastMessage)) {
      messageClass = 'highlight';
    } else if (this.message.type === 'deal_proposal' && ((!this.isMyMessage && this.isLastDealProposal && !this.hasMeetingDetails) || (!this.isMyMessage && this.isLastDealProposal && this.isLastMessage))) {
      messageClass = 'highlight';
    } else if (this.message.type === 'reschedule_proposal' && !this.isMyMessage && this.isLastRescheduleProposal && !this.hasCancellationRequest && !this.hasContinuationRequest) {
      messageClass = 'highlight';
    } else if (this.message.type === 'cancellation_request') {
      messageClass = 'highlight'; // Всегда подсвечивать запросы на отмену
    } else if (this.message.type === 'continuation_request' && this.isMyMessage && this.isLastContinuationRequest && this.isLastMessage) {
      messageClass = 'highlight';
    } else if (this.message.type === 'continuation_request' && !this.isMyMessage && this.isLastContinuationRequest) {
      messageClass = 'highlight';
    }
    return messageClass;
  },

    isMyMessage() {
      return this.message.sender === this.currentUser._id;
    },

    hasMeetingDetails() {
      const statusAllow = ["pending", "pending_update"];
      const hasMeetingDetailsMessage = this.allMessages.some(msg => msg.type === 'meeting_details');
      const hasDisallowedDealStatus = this.getCurrentDeal && !statusAllow.includes(this.getCurrentDeal.status);

      return hasMeetingDetailsMessage && hasDisallowedDealStatus;
    },

    hasCancellationRequest() {
      return this.allMessages.some(msg => msg.type === 'cancellation_request');
    },

    hasContinuationRequest() {
      return this.allMessages.some(msg => msg.type === 'continuation_request') && this.getCurrentDeal?.continuation?.status === "true";
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

    isLastContinuationRequest() {
      const lastContinuationRequest = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'continuation_request');
      return this.message._id === lastContinuationRequest._id;
    },

    isLastMessage() {
      const lastMessage = this.allMessages[this.allMessages.length - 1];
      return this.message._id === lastMessage._id;
    },

  },

  methods: {
    openDealForm() {
      this.$emit('open-deal-form', this.message.content);
    },
    approveContinuation() {
      this.$emit('approve-continuation', this.message._id);
    },
    rejectContinuation() {
      this.$emit('reject-continuation', this.message._id);
    },
    approveCancellation() {
      this.$emit('approve-cancellation', this.message._id);
    },
    rejectCancellation() {
      this.$emit('reject-cancellation', this.message._id);
    },
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