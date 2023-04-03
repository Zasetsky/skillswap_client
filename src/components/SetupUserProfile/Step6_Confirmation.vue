<template>
  <v-layout>
    <v-flex xs12 sm4>
      <v-avatar :size="150" v-if="getAvatarUrl">
        <img :src="getAvatarUrl" alt="User Avatar" />
      </v-avatar>
    </v-flex>
    <v-flex xs12 sm8>
      <v-list>
        <v-list-item class="name-section">
        <v-list-item-content>
          <v-list-item-title>{{ firstName }} {{ lastName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

        <v-list-item>
          <v-list-item-title>Сильные навыки</v-list-item-title>
          <v-list-item-subtitle>{{ strongSkills.join(', ') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Слабые навыки</v-list-item-title>
          <v-list-item-subtitle>{{ weakSkills.join(', ') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Предпочтения обмена</v-list-item-title>
          <v-list-item-subtitle>{{ exchangePreferences.join(', ') }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Step6_Confirmation",
  beforeMount() {
    console.log('Avatar URL:', this.getAvatarUrl);
  },
  props: {
    strongSkills: Array,
    weakSkills: Array,
    exchangePreferences: Array,
  },
  computed: {  
    ...mapGetters("user", ["getUserProfile", "getAvatarUrl"]),
    firstName() {
      return this.getUserProfile.firstName;
    },
    lastName() {
      return this.getUserProfile.lastName;
    },
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
