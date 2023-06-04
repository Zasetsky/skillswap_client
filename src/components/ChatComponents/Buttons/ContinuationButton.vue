<template>
  <v-btn
    color="primary"
    :disabled="isDisabledButton"
    @click="handleRequestContinuation"
  >
    {{ getButtonText }}
  </v-btn>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('deal', ['getIsSending', 'getCurrentDeal']),
    ...mapGetters('chat', ['getCurrentChat']),

    getButtonText() {
      if (this.getIsSending) {
        return "Идёт загрузка...";
      } else {
        return "Предложить продолжение";
      }
    },

    isDisabledButton() {
      const pendingStatus = this.getCurrentDeal && this.getCurrentDeal.continuation?.status === "true";
      return this.getIsSending || pendingStatus;
    },
  },

  methods: {
    async handleRequestContinuation() {
      try {
        await this.$store.dispatch("deal/requestContinuation", {
          dealId: this.getCurrentDeal._id
        });

        await this.$store.dispatch('chat/sendMessage', { chatId: this.getCurrentChat._id, type: 'continuation_request', content: ' ' });

        this.$emit("propose-continuation");
      } catch (error) {
        console.error("Error requesting continuation:", error);
      }
    },
    
  },
};
</script>
<style scoped>
/* add any custom styles for the component here */
</style>