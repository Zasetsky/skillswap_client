<template>
  <div>
    <h3>Активный запрос</h3>
    <weak-skills-card
      v-for="request in filteredSwapRequests"
      :key="request._id"
      :class="{ 'disabled-component': getIsBusy }"
      :request="request"
    />

    <v-card v-if="filteredSwapRequests.length === 0">
      <v-card-text>
        Здесь будет информация об активных сделках этого навыка
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import WeakSkillsCard from "./WeakSkillsCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    WeakSkillsCard,
  },

  computed: {
    ...mapGetters('swapRequests', ['filteredSwapRequests']),
    ...mapGetters("chat", [ "getIsBusy"]),
  },

  watch: {
    '$route.query.weakSkillId': {
      immediate: true,
      handler(newVal) {
        this.$store.commit('swapRequests/setFilterSkillId', newVal);
      },
    },
  },
}
</script>
<style scoped>
.disabled-component {
  pointer-events: none;
  opacity: 0.5;
}
</style>