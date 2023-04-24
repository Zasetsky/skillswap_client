<template>
  <div>
    <v-dialog v-model="dialog" width="600" @click:outside="resetForm">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="!getCurrentDeal || (getCurrentDeal && getCurrentDeal.status !== 'confirmed')"
          color="primary"
          v-bind="attrs"
          v-on="on"
          @click="openDialog"
        >
          {{ getActionButtonText }}
        </v-btn>
        <v-btn
          v-else
          color="primary"
          v-bind="attrs"
          v-on="on"
          @click="openDialog"
        >
          Предложить перенос
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
              :form="form1"
              @update:form="form1 = $event"
            />
          </v-tab-item>
          <v-tab-item :value="1">
            <deal-form
              :highlight-mismatched-fields="highlightMismatchedFields.form2"
              :form="{...form2, meetingDuration: form1.meetingDuration}"
              @update:form="form2 = $event"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
          <v-btn 
            v-if="(getCurrentDeal && (!isConfirm || isFormChanged) && getCurrentDeal.status === 'pending') || (getCurrentDeal && (!isConfirm || isFormChanged) && getCurrentDeal.status === 'pending_update')"
            color="blue darken-1"
            :disabled="!isFormChanged"
            text
            @click="submitForm"
          >
            Отправить
          </v-btn>
          <v-btn 
            v-else-if="getCurrentDeal && getCurrentDeal.status === 'not_started'"
            color="blue darken-1"
            :disabled="!isBothFormsFilled"
            text
            @click="submitForm"
          >
            Отправить
          </v-btn>
          <v-btn v-else color="blue darken-1" text @click="emitConfirmDeal">Подтвердить</v-btn>
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
  data() {
    return {
      dialog: false,
      activeTab: 0,
      tabs: [],
      form1: {
        meetingDate: null,
        meetingTime: null,
        meetingDuration: null,
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

    highlightMismatchedFields() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      if (
        deal &&
        deal.status === "pending_update" &&
        currentUser._id !== deal.sender &&
        deal.update &&
        deal.update.form &&
        deal.update.form2
      ) {
        const form1Highlights = {};
        const form2Highlights = {};

        Object.keys(this.form1).forEach((field) => {
          form1Highlights[field] = deal.form[field] !== deal.update.form[field];
        });

        Object.keys(this.form2).forEach((field) => {
          form2Highlights[field] = deal.form2[field] !== deal.update.form2[field];
        });

        return { form1: form1Highlights, form2: form2Highlights };
      } else {
        return { form1: {}, form2: {} };
      }
    },

    getActionButtonText() {
      const currentDeal = this.getCurrentDeal;

      if (currentDeal) {
        if (currentDeal.status === "pending" || currentDeal.status === "pending_update" && currentDeal.sender === this.currentUser._id) {
          return "Изменить предложение";
        } else if (currentDeal.status === "pending" || currentDeal.status === "pending_update" && currentDeal.sender !== this.currentUser._id) {
          return "Подтвердить сделку";
        }
      }

      return "Согласовать сделку";
    },

    isFormChanged() {
      if (this.getCurrentDeal) {
        const deal = this.getCurrentDeal;

        // Определяем, с какими формами следует сравнивать
        const referenceForm1 = deal.status === 'pending_update' ? deal.update.form : deal.form;
        const referenceForm2 = deal.status === 'pending_update' ? deal.update.form2 : deal.form2;

        // Проверяем каждую форму
        const form1Changed = Object.entries(this.form1).some(([key, value]) => {
          return value !== referenceForm1[key];
        });
        const form2Changed = Object.entries(this.form2).some(([key, value]) => {
          return value !== referenceForm2[key];
        });

        // Возвращаем true, если хотя бы одна из форм изменена
        return form1Changed || form2Changed;
      } else {
        return false;
      }
    },

    isBothFormsFilled() {
      return (
        this.form1.meetingDate &&
        this.form1.meetingTime &&
        this.form1.meetingDuration &&
        this.form2.meetingDate &&
        this.form2.meetingTime
      );
    },

    isConfirm() {
      const deal = this.getCurrentDeal;
      const currentUser = this.currentUser;

      return (
        deal &&
        (deal.status === "pending" || 
        (deal.status === "pending_update" && deal.sender !== currentUser._id))
      );
    },
  },

  watch: {
    getCurrentDeal: {
      handler(newValue) {
        if (newValue) {
          if (newValue.status === "pending_update") {
            this.fillForm(this.form1, newValue.update.form);
            this.fillForm(this.form2, newValue.update.form2);
          } else {
            this.fillForm(this.form1, newValue.form || {});
            this.fillForm(this.form2, newValue.form2 || {});
          }
        } else {
          this.fillForm(this.form1, {});
          this.fillForm(this.form2, {});
        }
      },
      deep: true,
      immediate: true,
    },
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
        console.error('Текущий чат не найден');
        return;
      }

      const swapRequestId = this.getCurrentChat.swapRequestId;
      const swapRequest = this.getSwapRequests.find((request) => request._id === swapRequestId);

      if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
        const skillsToTeach = swapRequest.senderData.skillsToTeach?.[0]?.skill || swapRequest.receiverData.skillsToTeach?.[0]?.skill;
        const skillsToLearn = swapRequest.senderData.skillsToLearn?.[0]?.skill || swapRequest.receiverData.skillsToLearn?.[0]?.skill;

        if (skillsToTeach && skillsToLearn) {
          this.tabs.push(skillsToLearn);
          this.tabs.push(skillsToTeach);
          this.activeTab = 0;
        } else {
          console.error('Не удалось найти данные навыков');
        }
      }
    },

    async openDialog() {
      try {
        await this.createOrGetCurrentDeal({
          participants: this.getCurrentChat.participants,
          chatId: this.getCurrentChat._id,
          swapRequestId: this.getCurrentChat.swapRequestId,
        });
      } catch (error) {
        console.error("Ошибка при создании сделки: ", error);
      }

      this.dialog = true;
    },

    submitForm() {
      // Проверяем, заполнены ли обе формы
      if (!this.form1.meetingDate || !this.form1.meetingTime || !this.form1.meetingDuration) {
        alert('Пожалуйста, заполните все поля для первой формы');
        return;
      }
      if (!this.form2.meetingDate || !this.form2.meetingTime) {
        alert('Пожалуйста, заполните все поля для второй формы');
        return;
      }

      // Передаем обе формы
      this.$emit('submit-deal-form', {
        formData1: {
          meetingDate: this.form1.meetingDate,
          meetingTime: this.form1.meetingTime,
          meetingDuration: this.form1.meetingDuration,
        },
        formData2: {
          meetingDate: this.form2.meetingDate,
          meetingTime: this.form2.meetingTime,
          meetingDuration: this.form1.meetingDuration,
        },
      });

      this.dialog = false;
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
      this.dialog = false;
    },

    close() {
      this.dialog = false;
      this.resetForm();
    },

    resetForm() {
      this.dialog = false;
      if (!this.deal || !this.deal.form) {
        this.form1 = {
          meetingDate: null,
          meetingTime: null,
          meetingDuration: null,
        };
        this.form2 = {
          meetingDate: null,
          meetingTime: null,
        };
      } else {
        this.form1 = {
          meetingDate: this.deal.form.meetingDate || null,
          meetingTime: this.deal.form.meetingTime || null,
          meetingDuration: this.deal.form.meetingDuration || null,
        };
        this.form2 = {
          meetingDate: this.deal.form2.meetingDate || null,
          meetingTime: this.deal.form2.meetingTime || null,
        };
      }
    },
  },

  async mounted() {
    const chatId = localStorage.getItem('chatId');

    try {
      await this.fetchCurrentChat(chatId);
      await this.getAllSwapRequests();
      this.setTabs();
      this.dataLoaded = true;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>