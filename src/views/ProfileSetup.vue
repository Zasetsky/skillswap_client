<template>
  <v-container>
    <v-stepper v-model="step">
      <!-- <v-stepper-header>
        <v-stepper-step step="1" complete-icon="mdi-check">Аватар</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" complete-icon="mdi-check">Основная информация</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" complete-icon="mdi-check">Сильные навыки</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4" complete-icon="mdi-check">Слабые навыки</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="5" complete-icon="mdi-check">Предпочтения обмена</v-stepper-step>
      </v-stepper-header> -->

      <v-stepper-items>
        <v-stepper-content step="1">
          <Step1_Avatar @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <Step2_BasicInfo @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <Step3_StrongSkills @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="4">
          <Step4_WeakSkills @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="5">
          <Step5_ExchangePreferences @go-to-next-step="goToNextStep" />
        </v-stepper-content>

      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import Step1_Avatar from '@/components/SetupUserProfile/Step1_Avatar.vue';
import Step2_BasicInfo from '@/components/SetupUserProfile/Step2_BasicInfo.vue';
import Step3_StrongSkills from '@/components/SetupUserProfile/Step3_StrongSkills.vue';
import Step4_WeakSkills from '@/components/SetupUserProfile/Step4_WeakSkills.vue';
import Step5_ExchangePreferences from '@/components/SetupUserProfile/Step5_ExchangePreferences.vue';

export default {
  
  name: 'ProfileSetup',
  components: {
    Step1_Avatar,
    Step2_BasicInfo,
    Step3_StrongSkills,
    Step4_WeakSkills,
    Step5_ExchangePreferences,
  },
  data() {
    return {
      step: 1,
    };
  },
  methods: {
    // loadStepFromLocalStorage() {
    //   const storedStep = localStorage.getItem("currentStep");
    //   if (storedStep) {
    //     this.step = parseInt(storedStep, 10);
    //   }
    // },

    goToNextStep() {
      this.step++;
      localStorage.setItem("currentStep", this.step);
    },
  },

  // mounted() {
  //   this.loadStepFromLocalStorage();
  // },
};
</script>

<style scoped>
</style>
