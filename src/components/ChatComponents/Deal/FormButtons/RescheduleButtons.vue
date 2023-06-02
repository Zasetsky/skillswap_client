<template>
  <div>
    <v-btn
      v-if="showAcceptRejectButtons"
      color="green darken-1"
      text
      @click="emitConfirmReschedule"
    >
      Принять
    </v-btn>
    <v-btn
      v-if="showAcceptRejectButtons"
      color="red darken-1"
      text
      @click="emitRejectReschedule"
    >
      Отклонить
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isFormChanged: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("deal", ["getCurrentDeal"]),

    showAcceptRejectButtons() {
      const deal = this.getCurrentDeal;
      if (!deal ||
          ["true", "continued"].includes(deal.continuation?.status) || 
          ["true", "cancelled"].includes(deal.cancellation?.status)) {
        return false;
      }

      const isSender = deal.sender === this.currentUser._id;
      return (
        !isSender &&
        (deal.status === "reschedule_offer" || deal.status === "reschedule_offer_update") &&
        !this.isFormChanged
      );
    },
  },

  methods: {
    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
    },

    emitRejectReschedule() {
      this.$emit("reject-reschedule");
    },
  }
};
</script>
