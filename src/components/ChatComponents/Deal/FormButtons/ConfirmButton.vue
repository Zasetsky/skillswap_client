<template>
  <v-btn
    v-if="isConfirmButtonVisible"
    color="blue darken-1"
    text
    @click="confirmDeal"
  >
    Подтвердить
  </v-btn>
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

    isConfirmButtonVisible() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (!deal ||
          ["true", "continued"].includes(deal.continuation?.status) || 
          ["true", "cancelled"].includes(deal.cancellation?.status)) {
        return false;
      }

      // Если пользователь не является отправителем и статус сделки "pending_update" или "pending" и ни одна из форм не была изменена
      const visible = (
        (deal.status === "pending_update" || deal.status === "pending") &&
        deal.sender !== currentUser._id &&
        !this.isFormChanged
      );

      this.$store.dispatch('dealButtonsLocalState/setIsConfirmButtonVisible', visible);

      return visible;
    },
  },

  methods: {
    async confirmDeal() {
      try {
        await this.$store.dispatch("deal/confirmDeal", {
          dealId: this.getCurrentDeal._id,
        });

        this.$emit("confirm-deal");
      } catch (error) {
        console.error("Error confirming deal:", error);
      }
      this.$store.dispatch('dealButtonsLocalState/setIsDialogOpen', false);
    },
  },
};
</script>
