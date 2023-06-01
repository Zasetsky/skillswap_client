<template>
  <div>
    <h3>Полученные запросы на обмен</h3>
    <strong-skills-card
      v-for="receivedRequest in filteredReceivedRequests"
      :key="receivedRequest._id"
      :request="receivedRequest"
    >
      <v-select
        v-model="selectedSkillObject"
        :items="receivedRequest.senderData.skillsToTeach"
        label="Выберите навык для обучения"
        class="mt-4"
        item-text="skill"
        item-value="item"
        return-object
      >
      </v-select>
      <v-btn 
        class="mt-4"
        color="primary"
        :disabled="!selectedSkillObject.skill"
        @click="emitAcceptSwapRequest(receivedRequest._id)"
      >
        Принять запрос
      </v-btn>
      <v-btn class="mt-4 ml-2" color="error" @click="emitRejectSwapRequest(receivedRequest._id)">
        Отклонить запрос
      </v-btn>
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
      selectedSkillObject: {},
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    filteredReceivedRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const localSkillId = localStorage.getItem("strongSkillId");

      return this.getSwapRequests.filter(request => {
        return request.status === "pending" && request.senderData.skillsToLearn.some(skill => skill._id === localSkillId) && request.receiverId === this.currentUser._id;
      });
    },
  },

  methods: {
    async emitAcceptSwapRequest(swapRequestId) {
        this.$emit('accept-request', swapRequestId, this.selectedSkillObject);
    },

    async emitRejectSwapRequest(swapRequestId) {
        this.$emit('reject-request', swapRequestId);
    },
  },
};
</script>
