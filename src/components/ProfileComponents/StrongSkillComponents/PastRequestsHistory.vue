<template>
  <div>
    <h3>История запросов и сделок</h3>
    <strong-skills-card
      class="skill-card"
      v-for="pastRequest in pastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
      @open-chat="emitOpenChat"
    >
      <strong>Статус:</strong> {{ pastRequest.status }}
    </strong-skills-card>
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

    pastRequests() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      const localSkillId = localStorage.getItem("strongSkillId");

      return this.getSwapRequests.filter(request => {
        return (
          (request.senderData.skillsToLearn.some(skill => skill._id === localSkillId) ||
          request.senderData.skillsToTeach.some(skill => skill._id === localSkillId)) &&
          ["rejected", "cancelled", "completed"].includes(request.status)
        );
      });
    },
  },

  methods: {
    emitOpenChat(userId, requestId, chatId, status) {
      this.$emit('open-chat', userId, requestId, chatId, status);
    }
  },
};
</script>
