<template>
  <div class="step4-weak-skills">
    <h3>Слабые стороны</h3>
    <v-form ref="form">
      <v-autocomplete
        v-model="weakSkills"
        :items="skillsList"
        item-text="name"
        item-value="id"
        label="Выберите навыки, которые вы хотите улучшить"
        multiple
        chips
        outlined
      ></v-autocomplete>
    </v-form>
    <v-btn color="primary" @click="goToNextStep">Далее</v-btn>
  </div>
</template>

<script>
export default {
  name: "Step4_WeakSkills",
  data() {
    return {
      weakSkills: [],
      skillsList: [
        { id: 1, name: "Программирование" },
        { id: 2, name: "Дизайн" },
        { id: 3, name: "Маркетинг" },
        // добавьте дополнительные навыки по мере необходимости
      ],
    };
  },
  watch: {
    weakSkills: function (value) {
      this.$emit("weak-skills-changed", value);
    },
  },
  methods: {
    goToNextStep() {
      this.$emit("go-to-next-step");
    }
  }
};
</script>

<style scoped>
.step4-weak-skills {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
