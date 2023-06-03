<template>
  <div>
    <v-btn
      v-if="showAcceptRejectButtons"
      color="green darken-1"
      text
      @click="confirmReschedule"
    >
      Принять
    </v-btn>
    <v-btn
      v-if="showAcceptRejectButtons"
      color="red darken-1"
      text
      @click="rejectReschedule"
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
    async confirmReschedule() {
      try {
        await this.$store.dispatch("deal/confirmReschedule", {
          dealId: this.getCurrentDeal._id,
        });

        this.$emit("confirm-reschedule");
      } catch (error) {
        console.error("Error confirming deal:", error);
      }
    },

    async rejectReschedule() {
      try {
        await this.$store.dispatch("deal/rejectReschedule", {
          dealId: this.getCurrentDeal._id,
        });

        this.$emit("reject-reschedule");
      } catch (error) {
        console.error("Error confirming deal:", error);
      }
    }
  }
};
</script>
