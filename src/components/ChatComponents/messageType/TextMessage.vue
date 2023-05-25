<template>
  <span :class="messageClass">{{ message.content }}</span>
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