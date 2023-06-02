<template>
  <v-btn
    v-if="sendButtonState.visible && (isFormChanged || !isConfirmButtonVisible)"
    color="blue darken-1"
    :disabled="!sendButtonState.enabled"
    text
    @click="submitForm"
  >
    {{ sendButtonState.text }}
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
    isBothFormsFilled: {
      type: Boolean,
      default: false,
    },
    isConfirmButtonVisible: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("deal", ["getCurrentDeal"]),

    isConfirm() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      return (
        deal &&
        ((deal.status === "pending" || 
        deal.status === "pending_update") && deal.sender !== currentUser._id)
      );
    },

    sendButtonState() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (!deal || 
          ["true", "continued"].includes(deal.continuation?.status) || 
          ["true", "cancelled"].includes(deal.cancellation?.status)) {
        return { visible: false, enabled: false, text: '' };
      }

      const isSender = deal.sender === currentUser._id;
      const formChanged = this.isFormChanged;
      const bothFormsFilled = this.isBothFormsFilled;
      const dealNotStarted= ["not_started"].includes(deal.status);
      const dealPendingOrUpdate = ["pending_update", "pending"].includes(deal.status);
      const dealProcessStatus = ["confirmed", "half_completed", "confirmed_reschedule", "half_completed_confirmed_reschedule"].includes(deal.status);
      const statusesOfReschedule = ["reschedule_offer", "reschedule_offer_update"].includes(deal.status);

      const visible =
        (dealPendingOrUpdate || dealProcessStatus) ||
        (dealNotStarted || dealPendingOrUpdate && this.isConfirm) ||
        ((isSender || formChanged) && (statusesOfReschedule || dealPendingOrUpdate || dealProcessStatus));

      const enabled =
        (formChanged && !dealNotStarted) ||
        (dealNotStarted && bothFormsFilled) ||
        (formChanged && dealProcessStatus);

      let text = '';
      if (statusesOfReschedule || dealPendingOrUpdate) {
        text = 'Изменить';
      } else if (dealNotStarted) {
        text = 'Отправить';
      } else if (dealProcessStatus) {
        text = 'Предложить';
      }

      return { visible, enabled, text };
    },
  },

  methods: {
    submitForm() {
      let dataToEmit;

      if (!this.completedForms.form1 && !this.completedForms.form2) {
        // Обе формы не завершены, поэтому передаем обе
        dataToEmit = {
          formData1: {
            skill: this.skillsToLearn,
            meetingDate: this.form1.meetingDate,
            meetingTime: this.form1.meetingTime,
            meetingDuration: this.commonMeetingDuration,
          },
          formData2: {
            skill: this.skillsToTeach,
            meetingDate: this.form2.meetingDate,
            meetingTime: this.form2.meetingTime,
            meetingDuration: this.commonMeetingDuration,
          },
        };
      } else {
        // Одна или обе формы завершены, передаем только formData1
        dataToEmit = {
          formData1: {
            skill: this.skillsToLearn,
            meetingDate: this.form1.meetingDate,
            meetingTime: this.form1.meetingTime,
            meetingDuration: this.commonMeetingDuration,
          }
        };
      }
      this.$emit('submit-deal-form', dataToEmit);
      this.$emit('close-form');
    },
  }
}
</script>
