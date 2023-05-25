<template>
  <div>
    <span :class="messageClass">{{ message.content }}</span>
    <span v-if="isMyMessage && isLastMessage" :class="messageClass">Вы отвергли предложение о продолжении</span>
    <v-btn v-if="!isMyMessage && isLastMessage"
            color="primary"
            small
            @click="$emit('open-deal-form')">
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
  emits: ['open-deal-form'],
  computed: {
    messageClass() {
      return this.isMyMessage ? 'my-message-class' : 'other-message-class';
    }
  }
};
</script>