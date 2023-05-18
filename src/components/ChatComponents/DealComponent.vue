<template>
  <div>
    <v-dialog v-model="dialog" width="600" @click:outside="resetForm">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          :disabled="disabled"
          @click="openDialog"
        >
          {{ getActionButtonText }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title>Форма согласования сделки</v-card-title>
        <v-tabs v-model="activeTab" background-color="transparent" show-arrows>
          <v-tab v-for="(tab, index) in tabs" :key="index">{{ tab }}</v-tab>
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
  },

  data() {
    return {
      dialog: false,
      isSubmitting: false,
      actionButtonText: "",
      activeTab: 0,
      skillsToTeach: null,
      skillsToLearn: null,
      tabs: [],
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
    ...mapGetters("swapRequests", ["getSwapRequests"]),
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

    highlightMismatchedFields() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (
        deal &&
        (deal.status === "pending_update" || deal.status === "reschedule_offer" || deal.status === "reschedule_offer_update") &&
        currentUser._id !== deal.sender
      ) {
        let form1Source, form2Source;

        if (deal.status === "pending_update") {
          form1Source = deal.form;
          form2Source = deal.form2;
        } else if (deal.status === "reschedule_offer" || deal.status === "reschedule_offer_update") {
          form1Source = deal.reschedule.form;
          form2Source = deal.reschedule.form2;
        }

        const form1Highlights = {};
        const form2Highlights = {};
        console.log(this.commonMeetingDuration);
        if (deal.status === "pending_update") {
          Object.keys(deal.form).forEach((field) => {
            form1Highlights[field] = deal.form[field] !== deal.update.form[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form[field]);
          });

          Object.keys(deal.form2).forEach((field) => {
            form2Highlights[field] = deal.form2[field] !== deal.update.form2[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form2[field]);
          });
        } else if (deal.status === "reschedule_offer") {
          Object.keys(deal.form).forEach((field) => {
            form1Highlights[field] = form1Source[field] !== deal.form[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form[field]);
          });

          Object.keys(deal.form2).forEach((field) => {
            form2Highlights[field] = form2Source[field] !== deal.form2[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.form2[field]);
          });
        } else {
          Object.keys(deal.form).forEach((field) => {
            form1Highlights[field] = form1Source[field] !== deal.update.form[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.reschedule.form[field]);
          });

          Object.keys(deal.form2).forEach((field) => {
            form2Highlights[field] = form2Source[field] !== deal.update.form2[field] || (field === 'meetingDuration' && this.commonMeetingDuration !== deal.reschedule.form2[field]);
          });
        }

        return { form1: form1Highlights, form2: form2Highlights };
      } else {
        return { form1: {}, form2: {} };
      }
    },
    
    isFormChanged() {
      const deal = this.getCurrentDeal;
      if (!deal || !deal.form || !deal.form2) {
        return false;
      }

      let referenceForm1, referenceForm2, referenceDuration;

      // Определяем, с какими формами следует сравнивать
      if (deal.status === "pending_update") {
        referenceForm1 = deal.update.form;
        referenceForm2 = deal.update.form2;
        referenceDuration = deal.update.form.meetingDuration;
      } else if (deal.status === "reschedule_offer") {
        referenceForm1 = deal.reschedule.form;
        referenceForm2 = deal.reschedule.form2;
        referenceDuration = deal.reschedule.form.meetingDuration;
      } else if (deal.status === "reschedule_offer_update") {
        referenceForm1 = deal.reschedule.form;
        referenceForm2 = deal.reschedule.form2;
        referenceDuration = deal.reschedule.form.meetingDuration;
      } else {
        referenceForm1 = deal.form;
        referenceForm2 = deal.form2;
        referenceDuration = deal.form.meetingDuration;
      }

      if (!referenceForm1 || !referenceForm2) {
        return false;
      }

      // Проверяем каждую форму
      const form1Changed = Object.entries(this.form1).some(([key, value]) => {
        return value !== referenceForm1[key];
      });
      const form2Changed = Object.entries(this.form2).some(([key, value]) => {
        return value !== referenceForm2[key];
      });
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

      if (!deal) {
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
      if (!deal) {
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

      // Если пользователь не является отправителем и статус сделки "pending_update" или "pending" и ни одна из форм не была изменена
      return (
        deal &&
        (deal.status === "pending_update" || deal.status === "pending") &&
        deal.sender !== currentUser._id &&
        !this.isFormChanged
      );
    },

    getActionButtonText() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;
      const changeOffers = ["pending_update", "pending", "reschedule_offer", "reschedule_offer_update"].includes(deal.status);
      const statusesOfReschedule = ["confirmed", "half_completed", "confirmed_reschedule", "half_completed_confirmed_reschedule"].includes(deal.status);
      if (deal) {
        if (this.isSubmitting) {
          return "Отправка...";
        } else if (changeOffers && deal.sender === currentUser._id) {
          return "Изменить предложение";
        } else if (changeOffers && deal.sender !== currentUser._id) {
          return "Посмотреть предложения";
        } else if (statusesOfReschedule) {
          return "Предложить перенос";
        }
      }
      return "Согласовать сделку";
    }
  },

  methods: {
    ...mapActions("swapRequests", ["getAllSwapRequests"]),
    ...mapActions("chat", ["fetchCurrentChat"]),
    ...mapActions("deal", ["createOrGetCurrentDeal"]),

    fillForm(form, source) {
      Object.keys(form).forEach((field) => {
        form[field] = source[field] || null;
      });
    },

    setTabs() {
      if (!this.getCurrentChat) {
        console.error("Текущий чат не найден");
        return;
      }

      const swapRequestId = this.getCurrentChat.swapRequestId;
      const swapRequest = this.getSwapRequests.find(
        (request) => request._id === swapRequestId
      );

      if (
        swapRequest &&
        swapRequest.senderData &&
        swapRequest.receiverData
      ) {
        this.skillsToTeach =
          swapRequest.senderData.skillsToTeach?.[0]?.skill ||
          swapRequest.receiverData.skillsToLearn?.[0]?.skill;
        this.skillsToLearn =
          swapRequest.senderData.skillsToLearn?.[0]?.skill ||
          swapRequest.receiverData.skillsToTeach?.[0]?.skill;

        if (this.skillsToTeach && this.skillsToLearn) {
          this.tabs = [this.skillsToLearn, this.skillsToTeach];
          this.activeTab = 0;
        } else {
          console.error("Не удалось найти данные навыков");
        }
      }
    },

    async openDialog() {
      this.dialog = true;
    },

    submitForm() {
      // Проверяем, заполнены ли обе формы
      if (!this.form1.meetingDate || !this.form1.meetingTime) {
        alert('Пожалуйста, заполните все поля для первой формы');
        return;
      }
      if (!this.form2.meetingDate || !this.form2.meetingTime) {
        alert('Пожалуйста, заполните все поля для второй формы');
        return;
      }
      if (!this.commonMeetingDuration) {
        alert('Пожалуйста, заполните продолжительность сделки');
        return;
      }

      // Передаем обе формы
      this.$emit('submit-deal-form', {
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
      });

      this.dialog = false;
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
      this.dialog = false;
    },

    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
      this.dialog = false;
    },

    close() {
      this.dialog = false;
      this.resetForm();
    },

    resetForm() {
      if (!this.getCurrentDeal || !this.getCurrentDeal.form) {
        this.form1 = {
          meetingDate: null,
          meetingTime: null,
        };
        this.form2 = {
          meetingDate: null,
          meetingTime: null,
        };

        this.commonMeetingDuration = null;

      } else if (this.getCurrentDeal.status === "pending_update" || this.getCurrentDeal.status === "reschedule_offer_update") {
          this.fillForm(this.form1, this.getCurrentDeal.update.form);
          this.fillForm(this.form2, this.getCurrentDeal.update.form2);
          this.commonMeetingDuration = this.getCurrentDeal.update.form.meetingDuration;
        } else if (this.getCurrentDeal.status === "reschedule_offer") {
          this.fillForm(this.form1, this.getCurrentDeal.reschedule.form);
          this.fillForm(this.form2, this.getCurrentDeal.reschedule.form2);
          this.commonMeetingDuration = this.getCurrentDeal.reschedule.form.meetingDuration;
        } else {
          this.fillForm(this.form1, this.getCurrentDeal.form || {});
          this.fillForm(this.form2, this.getCurrentDeal.form2 || {});
          this.commonMeetingDuration = this.getCurrentDeal.form.meetingDuration;
      }
    },

  },

  watch: {
    getCurrentDeal: {
      handler(newValue) {
        if (newValue) {
          if (newValue.status === "pending_update") {
            this.fillForm(this.form1, newValue.update.form);
            this.fillForm(this.form2, newValue.update.form2);
            this.commonMeetingDuration = newValue.update.form.meetingDuration;
          } else if (newValue.status === "reschedule_offer" || newValue.status === "reschedule_offer_update") {
            this.fillForm(this.form1, newValue.reschedule.form);
            this.fillForm(this.form2, newValue.reschedule.form2);
            this.commonMeetingDuration = newValue.reschedule.form.meetingDuration;
          } else {
            this.fillForm(this.form1, newValue.form || {});
            this.fillForm(this.form2, newValue.form2 || {});
            this.commonMeetingDuration = newValue.form.meetingDuration || null;
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
      await this.getAllSwapRequests();
      this.setTabs();
    } catch (error) {
      console.error(error);
    }
  },
};
</script>
