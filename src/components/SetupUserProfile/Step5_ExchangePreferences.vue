<template>
  <div class="step5-exchange-preferences">
    <h3>Предпочтения обмена</h3>
    <v-form ref="form">
      <v-select
        v-model="exchangePreference"
        :items="exchangeOptions"
        item-text="name"
        item-value="name"
        label="Как вы предпочитаете обмениваться навыками?"
        outlined
      ></v-select>
    </v-form>
    <v-btn @click="saveAndGoToNextStep">Далее</v-btn>
  </div>
</template>
<script>

export default {
  name: "Step5_ExchangePreferences",
  data() {
    return {
      exchangePreference: null,
      exchangeOptions: [
        { name: "Онлайн" },
        { name: "Очно" },
        { name: "Гибкий подход (онлайн или очно)" },
      ],
    };
  },
  methods: {
    async saveAndGoToNextStep() {
      console.log('exchangePreference before dispatch:', this.exchangePreference);
      await this.$store.dispatch('user/updateUserAvailability', this.exchangePreference);
      // this.$emit('go-to-next-step');
    },
  },
};
</script>
<style scoped>
.step5-exchange-preferences {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>