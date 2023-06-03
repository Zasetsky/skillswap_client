<template>
  <v-btn
    v-if="sendButtonState.visible && (isFormChanged || !getIsConfirmButtonVisible)"
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
    skillsToTeach: {
      type: Object,
      default: null,
    },
    skillsToLearn: {
      type: Object,
      default: null,
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("deal", ["getCurrentDeal"]),
    ...mapGetters('chat', ['getCurrentChat']),
    ...mapGetters("dealFormLocalState", ["getForm1", "getForm2"]),
    ...mapGetters('dealFormLocalState', ['completedForms']),
    ...mapGetters('dealFormLocalState', ['commonMeetingDuration']),
    ...mapGetters("dealButtonsLocalState", ["getIsConfirmButtonVisible"]),

    isConfirm() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      return (
        deal &&
        ((deal.status === "pending" || 
        deal.status === "pending_update") && deal.sender !== currentUser._id)
      );
    },

    isBothFormsFilled() {
      return (
        this.getForm1.meetingDate &&
        this.getForm1.meetingTime &&
        this.commonMeetingDuration &&
        this.getForm2.meetingDate &&
        this.getForm2.meetingTime
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
    async submitForm() {
      const statusesOfReschedule = [
        "confirmed",
        "half_completed",
        "reschedule_offer",
        "reschedule_offer_update",
        "confirmed_reschedule",
        "half_completed_confirmed_reschedule"
      ];

      // Готовим данные
      let formData1, formData2;
      if (!this.completedForms.form1 && !this.completedForms.form2) {
        formData1 = {
          skillId: this.skillsToLearn._id,
          skill: this.skillsToLearn.skill,
          meetingDate: this.getForm1.meetingDate,
          meetingTime: this.getForm1.meetingTime,
          meetingDuration: this.commonMeetingDuration,
        };

        formData2 = {
          skillId: this.skillsToTeach._id,
          skill: this.skillsToTeach.skill,
          meetingDate: this.getForm2.meetingDate,
          meetingTime: this.getForm2.meetingTime,
          meetingDuration: this.commonMeetingDuration,
        };
      } else if (this.completedForms.form1 && !this.completedForms.form2) {
        formData1 = {
          skillId: this.skillsToTeach._id,
          skill: this.skillsToTeach.skill,
          meetingDate: this.getForm1.meetingDate,
          meetingTime: this.getForm1.meetingTime,
          meetingDuration: this.commonMeetingDuration,
        };
      } else {
        formData1 = {
          skillId: this.skillsToLearn._id,
          skill: this.skillsToLearn.skill,
          meetingDate: this.getForm1.meetingDate,
          meetingTime: this.getForm1.meetingTime,
          meetingDuration: this.commonMeetingDuration,
        };
      }

      try {
        if (!this.getCurrentDeal || !this.skillsToLearn || !this.skillsToTeach || !this.getCurrentChat) {
          console.error("Some necessary data is missing. Cannot submit form.");
          return;
        }

        if (!statusesOfReschedule.includes(this.getCurrentDeal.status)) {
          await this.$store.dispatch("deal/updateDeal", {
            dealId: this.getCurrentDeal._id,
            formData1,
            formData2,
          });

          await this.$store.dispatch('chat/sendMessage', { chatId: this.getCurrentChat._id, type: 'deal_proposal', content: ' ' });
        } else {
          const rescheduleFormData = this.completedForms.form1 || this.completedForms.form2
            ? { formData1 }
            : { formData1, formData2 };

          await this.$store.dispatch("deal/proposeRescheduleDeal", {
            dealId: this.getCurrentDeal._id,
            ...rescheduleFormData,
          });

          await this.$store.dispatch('chat/sendMessage', { chatId: this.getCurrentChat._id, type: 'reschedule_proposal', content: ' ' });
        }

        this.$emit('submit-deal-form');
      } catch (error) {
        console.error("Error during async submit:", error);
      }
      this.$store.dispatch('dealButtonsLocalState/setIsDialogOpen', false);
    },

  },
}
</script>
