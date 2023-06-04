<template>
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
          :highlightMismatchedFields="highlightMismatchedFields.form1"
          formName="form1"
        />
      </v-tab-item>
      <v-tab-item :value="1">
        <deal-form
          :highlightMismatchedFields="highlightMismatchedFields.form2"
          formName="form2"
        />
      </v-tab-item>
    </v-tabs-items>
    <v-card-actions>
      <v-spacer></v-spacer>
      <submit-button 
        :isFormChanged="isFormChanged"
        :skillsToTeach="skillsToTeach"
        :skillsToLearn="skillsToLearn"
        @submit-deal-form="emitSubmitForm"
      />
      <confirm-button
        :isFormChanged="isFormChanged"
        @confirm-deal="emitConfirmDeal"
      />
      <reschedule-buttons
        :isFormChanged="isFormChanged"
        @confirm-reschedule="emitConfirmReschedule"
        @reject-reschedule="emitRejectReschedule"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import DealForm from './DealForm.vue';
import SubmitButton from "./FormButtons/SubmitButton.vue";
import ConfirmButton from "./FormButtons/ConfirmButton.vue";
import RescheduleButtons from "./FormButtons/RescheduleButtons.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    DealForm,
    SubmitButton,
    ConfirmButton,
    RescheduleButtons
  },

  data() {
    return {
      activeTab: 0,
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getCurrentSwapRequest"]),
    ...mapGetters("deal", ["getCurrentDeal"]),
    ...mapGetters('dealFormLocalState', ['commonMeetingDuration']),
    ...mapGetters('dealFormLocalState', ['completedForms']),
    ...mapGetters("dealFormLocalState", ["getForm1", "getForm2"]),

    skillsToTeach() {
      const swapRequest = this.getCurrentSwapRequest;
      if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
        const skill = swapRequest.senderData.skillsToTeach?.[0] || swapRequest.receiverData.skillsToLearn?.[0];
        if (skill) {
          return {
            _id: skill._id,
            skill: skill.skill
          };
        }
      }
      return null;
    },

    skillsToLearn() {
      const swapRequest = this.getCurrentSwapRequest;
      if (swapRequest && swapRequest.senderData && swapRequest.receiverData) {
        const skill = swapRequest.senderData.skillsToLearn?.[0] || swapRequest.receiverData.skillsToTeach?.[0];
        if (skill) {
          return {
            _id: skill._id,
            skill: skill.skill
          };
        }
      }
      return null;
    },

    tabs() {
      const deal = this.getCurrentDeal;
      const tabs = [];

      let formIsNotCompleted1 = !deal || !deal.form || !deal.form.isCompleted || deal.form.isCompleted === false;
      let formIsNotCompleted2 = !deal || !deal.form2 || !deal.form2.isCompleted || deal.form2.isCompleted === false;

      if (this.skillsToLearn && formIsNotCompleted1) {
        tabs.push(this.skillsToLearn.skill);
      }

      if (this.skillsToTeach && formIsNotCompleted2) {
        tabs.push(this.skillsToTeach.skill);
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
        console.log('source:', deal.form2);
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
        referenceDuration = deal.update?.form?.meetingDuration || deal.update?.form2?.meetingDuration;
      }

      // Проверяем каждую форму в зависимости от завершенности форм
      let form1Changed = false;
      let form2Changed = false;
      if (!this.completedForms.form1 && !this.completedForms.form2) {
        form1Changed = Object.entries(this.getForm1 || {}).some(([key, value]) => {
          return value !== referenceForm1[key];
        });
        form2Changed = Object.entries(this.getForm2 || {}).some(([key, value]) => {
          return value !== referenceForm2[key];
        });
      } else if (this.completedForms.form1 && !this.completedForms.form2) {
        form1Changed = Object.entries(this.getForm1 || {}).some(([key, value]) => {
          return value !== referenceForm2[key];
        });
      } else if (!this.completedForms.form1 && this.completedForms.form2) {
        form1Changed = Object.entries(this.getForm1 || {}).some(([key, value]) => {
          return value !== referenceForm1[key];
        });
      }

      const durationChanged = this.commonMeetingDuration !== referenceDuration;

      // Возвращаем true, если хотя бы одна из форм изменена или продолжительность встречи изменена
      return form1Changed || form2Changed || durationChanged;
    },
  },

  methods: {
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

    emitSubmitForm() {
      this.$emit('submit-deal-form');
    },

    emitConfirmDeal() {
      this.$emit("confirm-deal");
    },

    emitConfirmReschedule() {
      this.$emit("confirm-reschedule");
    },
    
    emitRejectReschedule() {
      this.$emit("reject-reschedule");
    },
  },
};
</script>
<style scoped>
.mismatched-tab {
  border: 2px solid red;
}

</style>