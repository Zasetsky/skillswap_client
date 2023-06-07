<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-items>
        <v-stepper-content step="1">
          <Step1_Avatar @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <Step2_BasicInfo @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <Step3_4_Strong_And_WeakSkills
            :skillKit="'Strong'"
            @go-to-next-step="goToNextStep"
          />
        </v-stepper-content>

        <v-stepper-content step="4">
          <Step3_4_Strong_And_WeakSkills
            :skillKit="'Weak'"  
            @go-to-next-step="goToNextStep"
          />
        </v-stepper-content>

        <!-- <v-stepper-content step="5">
          <Step5_ExchangePreferences @finish-profile-setup="finishProfileSetup" />
        </v-stepper-content> -->

      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import Step1_Avatar from '@/components/PrsetupUserProfile/Step1_Avatar.vue';
import Step2_BasicInfo from '@/components/PrsetupUserProfile/Step2_BasicInfo.vue';
import Step3_4_Strong_And_WeakSkills from '@/components/PrsetupUserProfile/Step3_4_Strong_And_WeakSkills.vue';
// import Step5_ExchangePreferences from '@/components/PrsetupUserProfile/Step5_ExchangePreferences.vue';

import { mapGetters } from 'vuex';

export default {
  
  name: 'ProfileSetup',
  components: {
    Step1_Avatar,
    Step2_BasicInfo,
    Step3_4_Strong_And_WeakSkills,
    // Step5_ExchangePreferences,
  },
  data() {
    return {
      step: 1,
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
  },

  methods: {
    loadStepFromLocalStorage() {
      const userId = this.currentUser._id;
      const storedStep = localStorage.getItem(`currentStep_${userId}`);
      if (storedStep) {
        this.step = parseInt(storedStep, 10);
      }
    },

    goToNextStep() {
      const userId = this.currentUser._id;
      this.step++;
      localStorage.setItem(`currentStep_${userId}`, this.step);
    },
  },


  mounted() {
    this.loadStepFromLocalStorage();
  },
};
</script>
