<template>
  <v-btn
    color="primary"
    :disabled="isDisabledButton"
    @click="proposeContinuation"
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
    proposeContinuation() {
      this.$emit("propose-continuation");
    },
  },
};
</script>
<style scoped>
/* add any custom styles for the component here */
</style>