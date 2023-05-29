<template>
  <div>
    <span v-if="!isMyMessage" :class="messageClass">Поступил запрос на продолжение сделки:</span>
    <span v-if="isMyMessage" :class="messageClass">Вы запросили продолжение сделки</span>

    <v-btn
      v-if="!isMyMessage &&
            !getIsSending &&
            hasContinuationRequest &&
            isLastContinuationRequest"
      color="success"
      small
      @click="$emit('approve-continuation')"
    >
      Подтвердить
    </v-btn>
    <v-btn
      v-if="!isMyMessage &&
            !getIsSending &&
            hasContinuationRequest &&
            isLastContinuationRequest"
      color="error"
      small
      @click="$emit('reject-continuation')"
    >
      Отклонить
    </v-btn>
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
  computed: {
    ...mapGetters('deal', ['getIsSending']),
  }
};
</script>