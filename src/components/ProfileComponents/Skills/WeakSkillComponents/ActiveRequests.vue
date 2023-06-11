<template>
  <v-col cols="12" sm="6">
    <h3>Активный запрос</h3>
    <weak-skills-card
      v-for="request in getFilteredActiveRequests(localSkillId)"
      :key="request._id"
      :class="{ 'disabled-component': disabled }"
      :request="request"
    />

    <v-card v-if="getFilteredActiveRequests(localSkillId).length === 0">
      <v-card-text>
        Здесь будет информация об активных запросов этого навыка
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import WeakSkillsCard from "./WeakSkillsCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    WeakSkillsCard,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    localSkillId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters("swapRequests", ["getFilteredActiveRequests"]),
  }
}
</script>
<style scoped>
.disabled-component {
  pointer-events: none;
  opacity: 0.5;
}
</style>