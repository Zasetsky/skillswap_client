<template>
  <div class="step6-confirmation">
    <h3>Подтверждение информации</h3>
    <p>Пожалуйста, проверьте и подтвердите предоставленную информацию.</p>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Аватар</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-avatar :size="50" :src="avatar"></v-avatar>
        </v-list-item-icon>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Имя</v-list-item-title>
        </v-list-item-content>
        <v-list-item-subtitle>{{ name }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Сильные навыки</v-list-item-title>
        </v-list-item-content>
        <v-list-item-subtitle>{{ strongSkills.join(', ') }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Слабые навыки</v-list-item-title>
        </v-list-item-content>
        <v-list-item-subtitle>{{ weakSkills.join(', ') }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Предпочтения обмена</v-list-item-title>
        </v-list-item-content>
        <v-list-item-subtitle>{{ exchangePreferences.join(', ') }}</v-list-item-subtitle>
      </v-list-item>

    </v-list>
    <v-btn color="primary" @click="confirm">Подтвердить</v-btn>
  </div>
</template>

<script>
export default {
  name: "Step6_Confirmation",
  props: {
    avatar: String,
    name: String,
    strongSkills: Array,
    weakSkills: Array,
    exchangePreferences: Array,
  },
  methods: {
    confirm() {
      this.$emit("confirmation");
    },
  },
};
</script>

<style scoped>
.step6-confirmation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
