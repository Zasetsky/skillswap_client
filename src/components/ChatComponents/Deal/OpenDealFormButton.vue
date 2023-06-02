<template>
  <v-btn
    color="primary"
    :disabled="disabled && !isSubmitting"
    @click="openDialog"
  >
    {{ getActionButtonText }}
  </v-btn>
</template>
<script>
import { mapGetters } from "vuex";

export default {
    props: {
      disabled: Boolean,
      isSubmitting: Boolean
    },
  computed: {
    ...mapGetters("deal", ["getCurrentDeal"]),
    ...mapGetters("auth", ["currentUser"]),

    getActionButtonText() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (!deal) {
        return "Идёт загрузка...";
      }

      const changeOffers = ["pending_update", "pending", "reschedule_offer", "reschedule_offer_update"].includes(deal.status);
      const statusesOfReschedule = ["confirmed", "half_completed", "confirmed_reschedule", "half_completed_confirmed_reschedule"].includes(deal.status);

      if (this.isSubmitting) {
        return "Отправка...";
      } else if (changeOffers && deal.sender === currentUser._id) {
        return "Вы уже отправили предложение";
      } else if (changeOffers && deal.sender !== currentUser._id) {
        return "Посмотреть предложение";
      } else if (statusesOfReschedule) {
        return "Предложить перенос";
      }
      
      return "Согласовать сделку"; 
    },
  },
  methods: {
    async openDialog() {
      this.$emit('open-dialog');
    }
  }
}
</script>
