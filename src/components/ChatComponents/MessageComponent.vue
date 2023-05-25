<template>
  <div class="message-container" :class="{'my-message': isMyMessage, 'other-message': !isMyMessage}">
    <v-card class="message-card mb-2">
      <v-card-text>
        <component 
          :is="messageComponent"
          :message="message"
          :isMyMessage="isMyMessage"
          :isLastMessage="isLastMessage"
          :messageClass="messageClass"
          :hasRescheduleRequest="hasRescheduleRequest"
          :hasMeetingDetails="hasMeetingDetails"
          :hasCancellationRequest="hasCancellationRequest"
          :hasContinuationRequest="hasContinuationRequest"
          :isLastRescheduleProposal="isLastRescheduleProposal"
          :isLastContinuationRequest="isLastContinuationRequest"
          :isLastCancellationRequest="isLastCancellationRequest"
          :isLastDealProposal="isLastDealProposal"
          @approve-cancellation="approveCancellation"
          @reject-cancellation="rejectCancellation"
          @approve-continuation="approveContinuation"
          @reject-continuation="rejectContinuation"
          @open-deal-form="openDealForm"
        />
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import TextMessage from './messageType/TextMessage.vue'
import DetailsMessage from './messageType/DetailsMessage.vue'
import DealProposalMessage from './messageType/DealProposalMessage.vue'
import RescheduleProposalMessage from './messageType/RescheduleProposalMessage.vue'
import MeetingDetailsMessage from './messageType/MeetingDetailsMessage.vue'
import CancellationRequestMessage from './messageType/CancellationRequestMessage.vue'
import ContinuationRequestMessage from './messageType/ContinuationRequestMessage.vue'
import { mapGetters } from 'vuex';

export default {
  components: {
    TextMessage,
    DetailsMessage,
    DealProposalMessage,
    RescheduleProposalMessage,
    MeetingDetailsMessage,
    CancellationRequestMessage,
    ContinuationRequestMessage,
  },

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

    messageComponent() {
      switch(this.message.type) {
        case 'text':
          return 'TextMessage';
        case 'details':
          return 'DetailsMessage';
        case 'deal_proposal':
          return 'DealProposalMessage';
        case 'reschedule_proposal':
          return 'RescheduleProposalMessage';
        case 'meeting_details':
          return 'MeetingDetailsMessage';
        case 'cancellation_request':
          return 'CancellationRequestMessage';
        case 'continuation_request':
          return 'ContinuationRequestMessage';
        default:
          return '';
      }
    },

    messageClass() {
      let messageClass = 'normal';
      if (this.message.type === 'details' && (!this.isMyMessage && this.isLastMessage)) {
        messageClass = 'highlight';
      } else if (this.message.type === 'deal_proposal' && this.isLastDealProposal && !this.hasRescheduleRequest && !this.hasMeetingDetails && !this.hasCancellationRequest && !this.hasContinuationRequest) {
        messageClass = 'highlight';
      } else if (this.message.type === 'reschedule_proposal' && this.isLastRescheduleProposal && this.hasRescheduleRequest && !this.hasCancellationRequest && !this.hasContinuationRequest && !this.hasMeetingDetails) {
        messageClass = 'highlight';
      } else if (this.message.type === 'cancellation_request' && this.hasCancellationRequest && this.isLastCancellationRequest) {
        messageClass = 'highlight';
      } else if (this.message.type === 'continuation_request' && this.hasContinuationRequest && this.isLastContinuationRequest) {
        messageClass = 'highlight';
      }
      return messageClass;
    },

    isMyMessage() {
      return this.message.sender === this.currentUser._id;
    },

    hasRescheduleRequest() {
      if (!this.getCurrentDeal) {
        return false;
      }
      const rescheduleStatuses = ["reschedule_offer", "reschedule_offer_update"].includes(this.getCurrentDeal.status);
      return this.allMessages.some(msg => msg.type === 'reschedule_proposal') && rescheduleStatuses;
    },

    hasMeetingDetails() {
      const pendingStatuses = ["pending", "pending_update"];
      const hasMeetingDetailsMessage = this.allMessages.some(msg => msg.type === 'meeting_details');
      const hasDispendingDealStatus = this.getCurrentDeal && !pendingStatuses.includes(this.getCurrentDeal.status);

      return hasMeetingDetailsMessage && hasDispendingDealStatus && !this.hasRescheduleRequest;
    },

    hasCancellationRequest() {
      return this.allMessages.some(msg => msg.type === 'cancellation_request') && this.getCurrentDeal && this.getCurrentDeal.cancellation?.status === "true";
    },

    hasContinuationRequest() {
      return this.allMessages.some(msg => msg.type === 'continuation_request') && this.getCurrentDeal && this.getCurrentDeal.continuation?.status === "true";
    },

    isLastRescheduleProposal() {
      const lastRescheduleProposal = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'reschedule_proposal');

      return lastRescheduleProposal && this.message._id === lastRescheduleProposal._id;
    },

    isLastDealProposal() {
      const lastDealProposal = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'deal_proposal');

      return lastDealProposal && this.message._id === lastDealProposal._id;
    },

    isLastContinuationRequest() {
      const lastContinuationRequest = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'continuation_request');

      return lastContinuationRequest && this.message._id === lastContinuationRequest._id;
    },

    isLastCancellationRequest() {
      const lastCancellationRequest = this.allMessages
        .slice()
        .reverse()
        .find((msg) => msg.type === 'cancellation_request');

      return lastCancellationRequest && this.message._id === lastCancellationRequest._id;
    },

    isLastMessage() {
      const lastMessage = this.allMessages[this.allMessages.length - 1];
      return this.message._id === lastMessage._id;
    },

  },

  methods: {
    openDealForm() {
      this.$emit('open-deal-form');
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

<style>
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

.highlight {
  font-weight: bold;
  font-size: 15px;
}

.normal {
  font-weight: normal;
}
</style>


