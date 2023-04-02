<template>
  <div class="step3-strong-skills">
    <h3>Сильные стороны</h3>
    <v-form ref="form">
      <v-autocomplete
        v-model="strongSkills"
        :items="skillsList"
        item-text="name"
        item-value="id"
        label="Выберите свои сильные навыки"
        multiple
        chips
        outlined
      ></v-autocomplete>
      <v-btn color="primary" @click="goToNextStep">Далее</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
name: "Step3_StrongSkills",
data() {
  return {
    strongSkills: [],
    skillsList: [
      { id: 1, name: "Программирование" },
      { id: 2, name: "Дизайн" },
      { id: 3, name: "Маркетинг" },
      // добавьте дополнительные навыки по мере необходимости
    ],
  };
},
methods: {
  goToNextStep() {
    this.$emit("go-to-next-step");
  }
},
watch: {
  strongSkills: function (value) {
    this.$emit("strong-skills-changed", value);
  },
},
};
</script>

<style scoped>
.step3-strong-skills {
display: flex;
flex-direction: column;
gap: 1rem;
}
</style>
