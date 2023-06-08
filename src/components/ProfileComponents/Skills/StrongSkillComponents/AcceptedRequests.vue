<template>
  <div>
    <h3>Принятые запросы и начатые сделки</h3>
    <strong-skills-card
      v-for="acceptedRequest in acceptedRequests"
      :key="acceptedRequest._id"
      :class="{ 'disabled-component': disabled }"
      :request="acceptedRequest"
      @open-chat="emitOpenChat"
    >
    </strong-skills-card>
    <v-card v-if="acceptedRequests.length === 0">
      <v-card-text>
        Здесь будет информация об принятых запросах и активных сделках этого навыка
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import StrongSkillsCard from "./StrongSkillsCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    StrongSkillsCard
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    acceptedRequests() {
      const localSkillId = localStorage.getItem("strongSkillId");

      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return (
          (request.senderData.skillsToLearn.some(skill => skill._id === localSkillId) ||
          request.senderData.skillsToTeach.some(skill => skill._id === localSkillId)) &&
          (request.status === "accepted" || request.status === "active")
        );
      });
    },
  },

  methods: {
    emitOpenChat(receiverId, senderId, requestId, chatId, status) {
      this.$emit('open-chat', receiverId, senderId, requestId, chatId, status);
    }
  },
};
</script>

<style scoped>
.disabled-component {
  pointer-events: none;
  opacity: 0.5;
}
</style>
