<template>
  <div class="step5-exchange-preferences">
    <h3>Предпочтения обмена</h3>
    <v-form ref="form">
      <v-select
        v-model="exchangePreference"
        :items="exchangeOptions"
        item-text="name"
        item-value="id"
        label="Как вы предпочитаете обмениваться навыками?"
        outlined
      ></v-select>
    </v-form>
    <v-btn color="primary" @click="goToNextStep">Далее</v-btn>
  </div>
</template>
<script>
export default {
  name: "Step5_ExchangePreferences",
  data() {
    return {
      exchangePreference: null,
      exchangeOptions: [
        { id: 1, name: "Онлайн" },
        { id: 2, name: "Очно" },
        { id: 3, name: "Гибкий подход (онлайн или очно)" },
      ],
    };
  },
  watch: {
    exchangePreference: function (value) {
      this.$emit("exchange-preference-changed", value);
    },
  },
  methods: {
    goToNextStep() {
      this.$emit("go-to-next-step");
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