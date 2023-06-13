<template>
  <div>
    <h3>Полученные запросы на обмен</h3>
    <strong-skills-card
      v-for="receivedRequest in filteredReceivedRequests"
      :key="receivedRequest._id"
      :request="receivedRequest"
    >
    <template v-slot:actions>
        <v-select
          v-model="selectedSkill"
          :items="filteredSkillsToTeach(receivedRequest)"
          label="Выберите навык для обучения"
          class="actions mt-4"
          item-text="skill"
          item-value="item"
          return-object
        />

        <v-btn 
          class="actions mt-4"
          color="primary"
          :disabled="!selectedSkill?.skill"
          :style="!selectedSkill?.skill ? 'pointer-events: none' : ''"
          @click.stop="acceptSwapRequest(receivedRequest._id)"
        >
          Принять запрос
        </v-btn>
        <v-btn
          class="actions  mt-4 ml-2"
          color="error"
          @click.stop="rejectSwapRequest(receivedRequest._id)"
        >
          Отклонить запрос
        </v-btn>
      </template>
    </strong-skills-card>
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

  data() {
    return {
      selectedSkill: null,
    }
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

  methods: {
    async acceptSwapRequest(swapRequestId) {
      const chosenSkill = this.selectedSkill;
      try {
        await this.$store.dispatch('swapRequests/acceptSwapRequest', {
          swapRequestId,
          chosenSkill,
        });
      } catch (error) {
        console.error('Error accepting swap request:', error);
      }
    },

    isSkillActive(skillId) {
      const skill = this.currentUser.skillsToLearn.find(skill => skill._id === skillId);
      return skill ? skill.isActive : false;
    },

    filteredSkillsToTeach(receivedRequest) {
      return receivedRequest.senderData.skillsToTeach.filter(skill => !this.isSkillActive(skill._id));
    },

    async rejectSwapRequest(swapRequestId) {
      try {
        await this.$store.dispatch('swapRequests/rejectSwapRequest', swapRequestId);
      } catch (error) {
        console.error('Error rejecting swap request:', error);
      }
    },
  }
};
</script>
<style scoped>
.actions {
  pointer-events: auto;
}
</style>