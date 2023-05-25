<template>
  <div :class="messageClass">
    Навык: <b>{{ message.content.skill }}</b><br><br>
    Дата встречи: <b>{{ message.content.meetingDate }}</b><br>
    Время встречи: <b>{{ message.content.meetingTime }}</b><br>
    Продолжительность встречи: <b>{{ message.content.meetingDuration }}</b>
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
  },
  computed: {
    messageClass() {
      return this.isMyMessage ? 'my-message-class' : 'other-message-class';
    }
  }
};
</script>