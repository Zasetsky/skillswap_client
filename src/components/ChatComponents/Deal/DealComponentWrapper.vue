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
        ref="formWindow"
        :completedForms="completedForms"
        @confirm-deal="emitConfirmDeal"
        @confirm-reschedule="emitConfirmReschedule"
        @reject-reschedule="emitRejectReschedule"
        @submit-deal-form="emitSubmitForm"
        @close-form="close"
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
    completedForms: {
      type: Object,
      required: true,
    }
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
    },

    emitSubmitForm() {
      this.$emit('submit-deal-form');
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
      this.dialog = false;
    },

    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
      this.dialog = false;
    },
    
    emitRejectReschedule() {
      this.$emit("reject-reschedule");
      this.dialog = false;
    },

    close() {
      this.dialog = false;
      this.$refs.formWindow.resetForm();
    },
  },
};
</script>