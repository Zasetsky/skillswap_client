<template>
  <div v-if="getCurrentDeal && getCurrentDeal.status !== 'completed' && (!getCurrentDeal.cancellation || getCurrentDeal.cancellation?.status === 'false')">
    <v-dialog v-model="dialog" width="600" @click:outside="close">
      <template v-slot:activator="{ on, attrs }">
        <open-deal-form-button
          v-bind="attrs"
          v-on="on"
          :disabled="disabled && !isSubmitting"
          @open-dialog="openDialog"
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
      dialog: false,
      isSubmitting: false,
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("deal", ["getCurrentDeal"]),
  },

  methods: {
    async openDialog() {
      try {
        await this.$store.dispatch('deal/fetchCurrentDeal', {
          chatId: this.getCurrentChat._id,
        })

        } catch (error) {
          console.error("Error fetching current deal: ", error);
        } 
      this.dialog = true;
      this.$emit('open-deal-form');
    },

    emitSubmitForm() {
      this.dialog = false;
      this.$emit('submit-deal-form');
    },

    emitConfirmDeal() {
      this.dialog = false;
      this.$emit("confirm-deal");
    },

    emitConfirmReschedule() {
      this.dialog = false;
      this.$emit("confirm-reschedule");
    },
    
    emitRejectReschedule() {
      this.dialog = false;
      this.$emit("reject-reschedule");
      
    },

    close() {
      this.dialog = false;
      this.$store.dispatch('dealFormLocalState/resetForm');
    },
  },
};
</script>