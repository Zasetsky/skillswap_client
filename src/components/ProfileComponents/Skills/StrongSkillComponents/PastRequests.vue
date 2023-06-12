<template>
  <div>
    <h3>История запросов и сделок</h3>
    <strong-skills-card
      class="skill-card"
      v-for="pastRequest in pastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
    />

    <v-card v-if="pastRequests.length === 0">
      <v-card-text>Здесь будет информация о прошлых запросах этого навыка</v-card-text>
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
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("auth", ["currentUser"]),

    pastRequests() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const currentUserId = this.currentUser._id;
      const localSkillId = this.$route.query.strongSkillId;

      return this.getSwapRequests.filter(request => {
        let userIsSender = request.senderId === currentUserId;
        let userIsReceiver = request.receiverId === currentUserId;
        
        let skillsToCheck;

        if (userIsSender) {
          skillsToCheck = request.senderData.skillsToTeach;
        } else if (userIsReceiver) {
          skillsToCheck = request.senderData.skillsToLearn;
        }

        return (
          skillsToCheck.some(skill => skill._id === localSkillId) &&
          (
            userIsReceiver && ["rejected", "cancelled", "completed"].includes(request.status) ||
            userIsSender && ["cancelled", "completed"].includes(request.status)
          )
        );
      });
    },
  },
};
</script>
