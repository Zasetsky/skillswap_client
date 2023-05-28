<template>
  <div>
    <span v-if="!isMyMessage" :class="messageClass">Вам предложены параметры переноса сделки:</span>
    <span v-if="isMyMessage" :class="messageClass">Вы предложили перенос</span>
    <v-btn 
      v-if="!isMyMessage &&
            hasRescheduleRequest &&
            isLastRescheduleProposal &&
            !isDealCancelledOrCompleted &&
            !hasCancellationRequest &&
            !hasContinuationRequest &&
            !hasMeetingDetails"
      color="primary"
      small
      @click="$emit('open-deal-form')"
    >
      Открыть
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
    isMyMessage: {
      type: Boolean,
      default: false,
    },
    messageClass: {
      type: String,
      required: true,
    },
    isDealCancelledOrCompleted: {
      type: Boolean,
      default: false,
    },
    isLastRescheduleProposal: {
      type: Boolean,
      default: false,
    },
    hasRescheduleRequest: {
      type: Boolean,
      default: false,
    },
    hasCancellationRequest: {
      type: Boolean,
      default: false,
    },
    hasContinuationRequest: {
      type: Boolean,
      default: false,
    },
    hasMeetingDetails: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['open-deal-form'],
  mounted() {
    console.log(this.messageClass);
  }
};
</script>