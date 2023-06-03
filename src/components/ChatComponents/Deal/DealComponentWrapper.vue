<template>
  <div v-if="getCurrentDeal && getCurrentDeal.status !== 'completed' && (!getCurrentDeal.cancellation || getCurrentDeal.cancellation?.status === 'false')">
    <v-dialog v-model="getIsDialogOpen" width="600" @click:outside="close">
      <template v-slot:activator="{ on, attrs }">
        <open-deal-form-button
          v-bind="attrs"
          v-on="on"
          :disabled="disabled && !isSubmitting"
          @open-deal-form="emitOpenDealForm"
        />
      </template>

      <deal-form-window
        @confirm-deal="emitConfirmDeal"
        @confirm-reschedule="emitConfirmReschedule"
        @reject-reschedule="emitRejectReschedule"
        @submit-deal-form="emitSubmitForm"
      />
    </v-dialog>
  </div>
</template>

<script>
import OpenDealFormButton from "./OpenDealFormButton.vue";
import DealFormWindow from "./DealFormWindow.vue"

import { mapGetters } from "vuex";

export default {
  components: {
    OpenDealFormButton,
    DealFormWindow
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isSubmitting: false,
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("deal", ["getCurrentDeal"]),
    ...mapGetters("dealButtonsLocalState", ["getIsDialogOpen"]),
  },

  methods: {
    async emitOpenDealForm() {
      this.$emit("open-deal-form");
    },

    emitSubmitForm() {
      this.$emit('submit-deal-form');
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
    },

    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
    },
    
    emitRejectReschedule() {
      this.$emit("reject-reschedule");
      
    },

    close() {
      this.$store.dispatch('dealButtonsLocalState/setIsDialogOpen', false);
      this.$store.dispatch('dealFormLocalState/resetForm');
    },
  },
};
</script>