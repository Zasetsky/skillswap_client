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
        await this.sendMessage("continuation_request", " ");
        await this.$store.dispatch("deal/requestContinuation", {
          dealId: this.getCurrentDeal._id
        });

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