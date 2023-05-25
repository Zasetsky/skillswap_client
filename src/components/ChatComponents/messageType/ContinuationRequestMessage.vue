<template>
  <div>
    <span v-if="!isMyMessage" :class="messageClass">Поступил запрос на продолжение сделки:</span>
    <span v-if="isMyMessage" :class="messageClass">Вы запросили продолжение сделки</span>

    <v-btn
      v-if="!isMyMessage && hasContinuationRequest && isLastContinuationRequest"
      color="success"
      small
      @click="$emit('approve-continuation')"
    >
      Подтвердить
    </v-btn>
    <v-btn
      v-if="!isMyMessage && hasContinuationRequest && isLastContinuationRequest"
      color="error"
      small
      @click="$emit('reject-continuation')"
    >
      Отклонить
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
      default: false
    },
    hasContinuationRequest: {
      type: Boolean,
      default: false
    },
    isLastContinuationRequest: {
      type: Boolean,
      default: false
    },
    messageClass: {
      type: String,
      required: true,
    },
  },
};
</script>