<template>
  <div>
    <span v-if="!isMyMessage" :class="messageClass">Поступил запрос на отмену сделки:</span>
    <span v-if="isMyMessage" :class="messageClass">Вы запросили отмену сделки</span>

    <br v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest">
    <b v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest">Причина: {{ message.content.reason }}</b>
    <br v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest">

    <v-btn
      v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest"
      color="success"
      small
      @click="$emit('approve-cancellation')"
    >
      Подтвердить
    </v-btn>
    <v-btn
      v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest"
      color="error"
      small
      @click="$emit('reject-cancellation')"
    >
      Отклонить
    </v-btn>
    <br>

    <span 
      v-if="!isMyMessage && hasCancellationRequest && isLastCancellationRequest"
      style="color: red;"
    >
      Если вы не примете решение в течение 24 часов, ваша карма подпортится, и сделка всё равно будет отменена.
    </span>
    <span
      v-if="isMyMessage && hasCancellationRequest && isLastCancellationRequest"
      style="color: red;"
    >
      Если пользователь не примет решение в течение 24 часов, сделка всё равно будет отменена.
    </span>
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
    hasCancellationRequest: {
      type: Boolean,
      default: false,
    },
    isLastCancellationRequest: {
      type: Boolean,
      default: false,
    },
    messageClass: {
      type: String,
      required: true,
    },
  },
};
</script>