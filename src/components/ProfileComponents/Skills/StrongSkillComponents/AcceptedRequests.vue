<template>
  <div>
    <h3>Принятые запросы и начатые сделки</h3>
    <strong-skills-card
      v-for="acceptedRequest in filteredSwapRequests"
      :key="acceptedRequest._id"
      :class="{ 'disabled-component': getIsBusy }"
      :request="acceptedRequest"
      :deal="findDeal(acceptedRequest)"
    />

    <v-card v-if="filteredSwapRequests.length === 0">
      <v-card-text>
        Здесь будет информация об активных сделках этого навыка
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import StrongSkillsCard from "./StrongSkillsCard.vue";

import { mapGetters } from "vuex";
import skillMixins from "@/mixins/skillMixins";
import { getSocket } from "@/soket";

export default {
  mixins: [skillMixins],

  components: {
    StrongSkillsCard
  },

  computed: {
    ...mapGetters('swapRequests', ['filteredSwapRequests']),
    ...mapGetters('chat', ['getIsBusy']),
    ...mapGetters('deal', ['getAllDeals'])
  },

  async created() {
    await this.$store.dispatch("deal/fetchAllDeals");
  },

  beforeDestroy() {
    const socket = getSocket();

    socket.off("allDeals");
    socket.off("error");
  },

  watch: {
    '$route.query.strongSkillId': {
      immediate: true,
      handler(newVal) {
        this.$store.commit('swapRequests/setFilterSkillId', newVal);
      },
    },
  },
};
</script>

<style scoped>
.disabled-component {
  pointer-events: none;
  opacity: 0.5;
}
</style>
