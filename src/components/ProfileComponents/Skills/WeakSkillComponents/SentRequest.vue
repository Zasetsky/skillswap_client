<template>
  <div>
    <h3>Отправленные запросы на обмен</h3>
    <weak-skills-card
      v-for="receivedRequest in filteredSentRequests"
      :key="receivedRequest._id"
      :request="receivedRequest"
    />
    <v-card v-if="filteredSentRequests.length === 0">
      <v-card-text>
        Здесь будет информация об отправленных запросах на обмен этого навыка
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
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    filteredSentRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const localSkillId = this.$route.query.weakSkillId;

      return this.getSwapRequests.filter(request => {
        return request.status === "pending" && request.senderData.skillsToLearn.some(skill => skill._id === localSkillId) && request.senderId === this.currentUser._id;
      });
    },
  }
  
}
</script>
<style lang="">
  
</style>