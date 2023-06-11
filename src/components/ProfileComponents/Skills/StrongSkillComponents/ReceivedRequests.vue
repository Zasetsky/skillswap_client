<template>
  <div>
    <h3>Полученные запросы на обмен</h3>
    <strong-skills-card
      v-for="receivedRequest in filteredReceivedRequests"
      :key="receivedRequest._id"
      :request="receivedRequest"
    />
    <v-card v-if="filteredReceivedRequests.length === 0">
      <v-card-text>
        Здесь будет информация о полученных запросах на обмен этого навыка
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import StrongSkillsCard from "./StrongSkillsCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    StrongSkillsCard,
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    filteredReceivedRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const localSkillId = this.$route.query.strongSkillId;

      return this.getSwapRequests.filter(request => {
        return request.status === "pending" && request.senderData.skillsToLearn.some(skill => skill._id === localSkillId) && request.receiverId === this.currentUser._id;
      });
    },
  },
};
</script>
<style>
.select-area .v-select__selections {
  pointer-events: auto;
}
</style>