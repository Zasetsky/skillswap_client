<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step step="1" complete-icon="mdi-check">Аватар</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" complete-icon="mdi-check">Основная информация</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" complete-icon="mdi-check">Сильные навыки</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4" complete-icon="mdi-check">Слабые навыки</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="5" complete-icon="mdi-check">Предпочтения обмена</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="6" complete-icon="mdi-check">Подтверждение</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <Step1_Avatar @avatarSelected="avatarSelected" @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <Step2_BasicInfo @basic-info-updated="basicInfoUpdated" @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <Step3_StrongSkills @strong-skills-updated="strongSkillsUpdated" @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="4">
          <Step4_WeakSkills @weak-skills-updated="weakSkillsUpdated" @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="5">
          <Step5_ExchangePreferences @exchange-preferences-updated="exchangePreferencesUpdated" @go-to-next-step="goToNextStep" />
        </v-stepper-content>

        <v-stepper-content step="6">
          <Step6_Confirmation
            :avatar="avatar"
            :name="name"
            :strongSkills="strongSkills"
            :weakSkills="weakSkills"
            :exchangePreferences="exchangePreferences"
            @confirmation="finishProfileSetup"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import Step1_Avatar from '@/components/UserProfile/Step1_Avatar.vue';
import Step2_BasicInfo from '@/components/UserProfile/Step2_BasicInfo.vue';
import Step3_StrongSkills from '@/components/UserProfile/Step3_StrongSkills.vue';
import Step4_WeakSkills from '@/components/UserProfile/Step4_WeakSkills.vue';
import Step5_ExchangePreferences from '@/components/UserProfile/Step5_ExchangePreferences.vue';
import Step6_Confirmation from '@/components/UserProfile/Step6_Confirmation.vue';

export default {
  name: 'ProfileSetup',
  components: {
    Step1_Avatar,
    Step2_BasicInfo,
    Step3_StrongSkills,
    Step4_WeakSkills,
    Step5_ExchangePreferences,
    Step6_Confirmation,
  },
  data() {
    return {
      step: 1,
      avatar: null,
      name: "",
      strongSkills: [],
      weakSkills: [],
      exchangePreferences: []
    };
  },
  methods: {
    avatarSelected(avatar) {
      this.avatar = avatar;
    },
    basicInfoUpdated({ name }) {
      this.name = name;
    },
    strongSkillsUpdated(strongSkills) {
      this.strongSkills = strongSkills;
    },
    weakSkillsUpdated(weakSkills) {
      this.weakSkills = weakSkills;
    },
    exchangePreferencesUpdated(exchangePreferences) {
      this.exchangePreferences = exchangePreferences;
    },
    finishProfileSetup() {
      // Здесь вы можете отправить данные профиля на сервер или выполнить другие действия
      console.log("Профиль успешно настроен");
    },
    goToNextStep() {
      this.step++;
    }
  }
};
</script>

<style scoped>
.profile-setup {
  max-width: 800px;
  margin: 0 auto;
}
</style>
