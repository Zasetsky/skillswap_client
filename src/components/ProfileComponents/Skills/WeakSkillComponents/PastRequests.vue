<template>
  <div>
    <h3>История запросов и выполненных сделок</h3>
    <weak-skills-card
      v-for="pastRequest in filteredPastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
      :deal="findDeal(pastRequest)"
    />

    <v-card v-if="filteredPastRequests.length === 0">
      <v-card-text>Здесь будет информация об активной сделке</v-card-text>
    </v-card>
  </div>
</template>

<script>
import WeakSkillsCard from "./WeakSkillsCard.vue";

import { mapGetters } from "vuex";
import skillMixins from "@/mixins/skillMixins";

export default {
  mixins: [skillMixins],

  components: {
    WeakSkillsCard,
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters('deal', ['getAllDeals']),

    filteredPastRequests() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const localSkillId = this.$route.query.weakSkillId;

      const filteredRequests = this.getSwapRequests.filter(request => {
        return (
          (request.receiverData.skillsToLearn.some((skill) => skill._id === localSkillId) ||
          request.receiverData.skillsToTeach.some((skill) => skill._id === localSkillId)) &&
          (request.status !== "pending" && request.status !== "accepted")
          );
        });
    
      return filteredRequests;
    },
  },
}
</script>
