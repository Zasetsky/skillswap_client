<template>
  <div>
    <span :class="messageClass">{{ message.content }}</span>
    <span v-if="isMyMessage" :class="messageClass">Вы отвергли предложение о продолжении</span>
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
  emits: ['open-deal-form'],
  computed: {
    messageClass() {
      return this.isMyMessage ? 'my-message-class' : 'other-message-class';
    }
  }
};
</script>