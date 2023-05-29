<template>
  <div v-if="getCurrentDeal && getCurrentDeal.status !== 'completed' && (!getCurrentDeal.cancellation || getCurrentDeal.cancellation?.status === 'false')">
    <v-dialog v-model="dialog" width="600" @click:outside="resetForm">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          :disabled="disabled && !isSubmitting"
          @click="openDialog"
        >
          {{ getActionButtonText }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title>Форма согласования сделки</v-card-title>
        <v-tabs v-model="activeTab" background-color="transparent" show-arrows>
          <v-tab
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{'mismatched-tab': isMismatchedInTabs(index)}"
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item :value="0">
            <deal-form
              :highlight-mismatched-fields="highlightMismatchedFields.form1"
              :form="{...form1, meetingDuration: form1MeetingDuration}"
              @update:form="form1 = $event"
              @update:meetingDuration="form1MeetingDuration = $event"
            />
          </v-tab-item>
          <v-tab-item :value="1">
            <deal-form
              :highlight-mismatched-fields="highlightMismatchedFields.form2"
              :form="{...form2, meetingDuration: form2MeetingDuration}"
              @update:form="form2 = $event"
              @update:meetingDuration="form2MeetingDuration = $event"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="sendButtonState.visible && (isFormChanged || !isConfirmButtonVisible)"
            color="blue darken-1"
            :disabled="!sendButtonState.enabled"
            text
            @click="submitForm"
          >
            {{ sendButtonState.text }}
          </v-btn>
          <v-btn
            v-if="isConfirmButtonVisible"
            color="blue darken-1"
            text
            @click="emitConfirmDeal"
          >
            Подтвердить
          </v-btn>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DealForm from "./DealForm.vue";

export default {
  components: {
    DealForm,
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
      actionButtonText: "",
      activeTab: 0,
      commonMeetingDuration: null,
      form1: {
        meetingDate: null,
        meetingTime: null,
      },
      form2: {
        meetingDate: null,
        meetingTime: null,
      },
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("swapRequests", ["getCurrentSwapRequest"]),
    ...mapGetters("deal", ["getCurrentDeal"]),

    form1MeetingDuration: {
      get() {
        return this.commonMeetingDuration;
      },
      set(value) {
        this.commonMeetingDuration = value;
      }
    },

    form2MeetingDuration: {
      get() {
        return this.commonMeetingDuration;
      },
      set(value) {
        this.commonMeetingDuration = value;
      }
    },

    skillsToTeach() {
      const swapRequest = this.getCurrentSwapRequest;
      if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
        return swapRequest.senderData.skillsToTeach?.[0]?.skill || swapRequest.receiverData.skillsToLearn?.[0]?.skill;
      }
      return null;
    },

    skillsToLearn() {
      const swapRequest = this.getCurrentSwapRequest;
      if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
        return swapRequest.senderData.skillsToLearn?.[0]?.skill || swapRequest.receiverData.skillsToTeach?.[0]?.skill;
      }
      return null;
    },

    tabs() {
      const deal = this.getCurrentDeal;
      const tabs = [];

      let formIsNotCompleted1 = !deal || !deal.form || !deal.form.isCompleted || deal.form.isCompleted === false;
      let formIsNotCompleted2 = !deal || !deal.form2 || !deal.form2.isCompleted || deal.form2.isCompleted === false;

      if (this.skillsToLearn && formIsNotCompleted1) {
        tabs.push(this.skillsToLearn);
      }

      if (this.skillsToTeach && formIsNotCompleted2) {
        tabs.push(this.skillsToTeach);
      }

      return tabs;
    },

    highlightMismatchedFields() {
      if (this.isFormChanged) {
        return { form1: {}, form2: {} };
      }

      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (
        deal &&
        (deal.status === "pending_update" || deal.status === "reschedule_offer" || deal.status === "reschedule_offer_update") &&
        currentUser._id !== deal.sender
      ) {

        let form1Source = deal.update?.form;
        let form2Source = deal.update?.form2;

        const form1Highlights = {};
        const form2Highlights = {};
        let isForm1Changed = false;
        let isForm2Changed = false;

        // Проверяем первую форму, если она есть
        if(form1Source) {
          Object.keys(form1Source).forEach((field) => {
            const isFieldChanged = form1Source[field] !== deal.form[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form[field]);
            if (isFieldChanged) {
              isForm1Changed = true;
            }
            form1Highlights[field] = isFieldChanged;
          });
        }

        // Проверяем вторую форму, если она есть
        if(form2Source) {
          Object.keys(form2Source).forEach((field) => {
            const isFieldChanged = form2Source[field] !== deal.form2[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form2[field]);
            if (isFieldChanged) {
              isForm2Changed = true;
            }
            form2Highlights[field] = isFieldChanged;
          });
        }

        // Если form завершена, то подсвечиваем form1, даже если изменения были в form2
        if (deal.form.isCompleted) {
          return { form1: isForm2Changed ? form2Highlights : {}, form2: {} };
        } else if (deal.form2.isCompleted) {
          return { form1: isForm1Changed ? form1Highlights : {}, form2: {} };
        } else {
          return {
            form1: isForm1Changed ? form1Highlights : {},
            form2: isForm2Changed ? form2Highlights : {},
          };
        }
      }

      return { form1: {}, form2: {} };
    },

    
    isFormChanged() {
      const deal = this.getCurrentDeal;

      if (!deal || !deal.form || !deal.form2) {
        return false;
      }

      let referenceForm1 = deal.form;
      let referenceForm2 = deal.form2;
      let referenceDuration = deal.form?.meetingDuration;

      // Определяем, с какими формами следует сравнивать
      if (deal.status === "pending_update" || deal.status === "reschedule_offer_update" || deal.status === "reschedule_offer") {
        referenceForm1 = deal.update?.form || referenceForm1;
        referenceForm2 = deal.update?.form2 || referenceForm2;
        referenceDuration = deal.update?.form?.meetingDuration || referenceDuration;
      }

      // Проверяем каждую форму в зависимости от завершенности форм
      let form1Changed = false;
      let form2Changed = false;
      if (!this.completedForms.form1 && !this.completedForms.form2) {
        form1Changed = Object.entries(this.form1 || {}).some(([key, value]) => {
          return value !== referenceForm1[key];
        });
        form2Changed = Object.entries(this.form2 || {}).some(([key, value]) => {
          return value !== referenceForm2[key];
        });
      } else if (this.completedForms.form1 && !this.completedForms.form2) {
        form1Changed = Object.entries(this.form1 || {}).some(([key, value]) => {
          return value !== referenceForm2[key];
        });
      } else if (!this.completedForms.form1 && this.completedForms.form2) {
        form1Changed = Object.entries(this.form1 || {}).some(([key, value]) => {
          return value !== referenceForm1[key];
        });
      }

      const durationChanged = this.commonMeetingDuration !== referenceDuration;

      // Возвращаем true, если хотя бы одна из форм изменена или продолжительность встречи изменена
      return form1Changed || form2Changed || durationChanged;
    },

    isBothFormsFilled() {
      return (
        this.form1.meetingDate &&
        this.form1.meetingTime &&
        this.commonMeetingDuration &&
        this.form2.meetingDate &&
        this.form2.meetingTime
      );
    },

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

    isConfirmButtonVisible() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (!deal ||
          ["true", "continued"].includes(deal.continuation?.status) || 
          ["true", "cancelled"].includes(deal.cancellation?.status)) {
        return false;
      }

      // Если пользователь не является отправителем и статус сделки "pending_update" или "pending" и ни одна из форм не была изменена
      return (
        (deal.status === "pending_update" || deal.status === "pending") &&
        deal.sender !== currentUser._id &&
        !this.isFormChanged
      );
    },

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
    ...mapActions("swapRequests", ["fetchCurrentSwapRequest"]),
    ...mapActions("chat", ["fetchCurrentChat"]),
    ...mapActions("deal", ["fetchCurrentDeal"]),

    fillForm(form, source) {
      Object.keys(form).forEach((field) => {
        form[field] = source[field] || null;
      });
    },

    isMismatchedInTabs(index) {
      const deal = this.getCurrentDeal;

      if (deal && (deal.form.isCompleted || deal.form2.isCompleted)) {
        return false;
      }

      const form = this.highlightMismatchedFields[`form${index + 1}`];

      if (form) {
        const mismatches = Object.values(form);

        if (mismatches.some(field => field)) {
          return true;
        }
      }


      return false;
    },

    async openDialog() {
      try {
        await this.fetchCurrentDeal({
          chatId: this.getCurrentChat._id,
        });
        } catch (error) {
          console.error("Error fetching current deal: ", error);
        } 
      this.dialog = true;
    },

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
      this.close();
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
      this.resetForm();
    },

    resetForm() {
      const deal = this.getCurrentDeal;

      if (!deal || (!deal.form && !(deal.update && deal.update.form))) {
        this.form1 = {
          meetingDate: null,
          meetingTime: null,
        };
        this.form2 = {
          meetingDate: null,
          meetingTime: null,
        };

        this.commonMeetingDuration = null;
      } else {
        let form1Source, form2Source;

        if (deal.status === "pending_update" || deal.status === "reschedule_offer_update" || deal.status === "reschedule_offer") {
          form1Source = deal.update.form || {};
          form2Source = deal.update.form2 || {};
        } else {
          form1Source = deal.form || {};
          form2Source = deal.form2 || {};
        }

        this.handleFormFilling(form1Source, form2Source);
      }
    },

    handleFormFilling(formFromDeal, form2FromDeal) {
      if (!this.completedForms.form1 && !this.completedForms.form2) {
        this.fillForm(this.form1, formFromDeal ? formFromDeal : {});
        this.fillForm(this.form2, form2FromDeal ? form2FromDeal : {});

        this.updateCommonMeetingDuration(formFromDeal);
      } else if (this.completedForms.form1 && !this.completedForms.form2) {
        this.fillForm(this.form1, form2FromDeal ? form2FromDeal : {});

        this.updateCommonMeetingDuration(form2FromDeal);
      } else if (!this.completedForms.form1 && this.completedForms.form2) {
        this.fillForm(this.form1, formFromDeal ? formFromDeal : {});

        this.updateCommonMeetingDuration(formFromDeal);
      }
    },

    updateCommonMeetingDuration(form) {
      this.commonMeetingDuration = form ? form.meetingDuration : null;
    },

  },

  watch: {
    getCurrentDeal: {
      handler(newValue) {
        if (newValue) {
          if (
            newValue.status === "pending_update" ||
            newValue.status === "reschedule_offer_update" ||
            newValue.status === "reschedule_offer"
          ) {
            this.handleFormFilling(
              newValue.update && newValue.update.form,
              newValue.update && newValue.update.form2
            );
          } else {
            this.handleFormFilling(
              newValue.form,
              newValue.form2
            );
          }
        } else {
          this.fillForm(this.form1, {});
          this.fillForm(this.form2, {});
          this.commonMeetingDuration = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },

  async mounted() {
    const chatId = localStorage.getItem('chatId');

    try {
      await this.fetchCurrentChat(chatId);
      await this.fetchCurrentDeal({
        chatId: this.getCurrentChat._id,
      });
      await this.fetchCurrentSwapRequest(this.getCurrentDeal.swapRequestId);
    } catch (error) {
      console.error(error);
    }
  },
};
</script>
<style scoped>
.mismatched-tab {
  border: 2px solid red;  /* или любой другой стиль, который вы хотите использовать для подсветки */
}
</style>