<template>
  <div>
    <span :class="messageClass">Поступил запрос на продолжение сделки:</span>
    <span v-if="isMyMessage && isLastMessage" :class="messageClass">Вы запросили продолжение сделки</span>
    <v-btn v-if="!isMyMessage && isLastMessage"
            color="primary"
            small
            @click="$emit('handleContinuationRequest', message.content)">
      Рассмотреть
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
    isLastMessage: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    messageClass() {
      return this.isMyMessage ? 'my-message-class' : 'other-message-class';
    }
  }
};
</script>