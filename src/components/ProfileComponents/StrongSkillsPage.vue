<template>
  <v-container v-if="isLoading">
    Загрузка...
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <h2>{{ strongSkillObject.skill || strongSkillObject.category || strongSkillObject.subCategory }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <h3>Принятые запросы и начатые сделки</h3>
        <skill-card
          v-for="acceptedRequest in acceptedRequests"
          :key="acceptedRequest._id"
          :request="acceptedRequest"
          @open-chat="openChat"
        >
        </skill-card>
        <v-card v-if="acceptedRequests.length === 0">
          <v-card-text>
            Здесь будет информация об принятых запросах и активных сделках этого навыка
          </v-card-text>
        </v-card>

        <h3>Полученные запросы на обмен</h3>
        <skill-card
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
            @click="acceptSwapRequest(receivedRequest._id)"
          >
            Принять запрос
          </v-btn>
          <v-btn class="mt-4 ml-2" color="error" @click="rejectSwapRequest(receivedRequest._id)">
            Отклонить запрос
          </v-btn>
        </skill-card>
        <v-card v-if="filteredReceivedRequests.length === 0">
          <v-card-text>
            Здесь будет информация о полученных запросах на обмен этого навыка
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <h3>История запросов и сделок</h3>
        <skill-card
          class="skill-card"
          v-for="pastRequest in pastRequests"
          :key="pastRequest._id"
          :request="pastRequest"
          @open-chat="openChat"
        >
          <strong>Статус:</strong> {{ pastRequest.status }}
        </skill-card>
        <v-card v-if="pastRequests.length === 0">
          <v-card-text>Здесь будет информация о прошлых запросах этого навыка</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import SkillCard from "./SkillCard.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    SkillCard,
  },

  data() {
    return {
      isLoading: true,
      localSkillId: '',
      selectedSkillObject: {},
    }
  },
  
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    strongSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const skillId = this.localSkillId;
      return this.currentUser.skillsToTeach.find(skill => skill._id === skillId) || {};
    },

    filteredReceivedRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      return this.getSwapRequests.filter(request => {
        return request.status === "pending" && request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId) && request.receiverId === this.currentUser._id;
      });
    },

    acceptedRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return (
          (request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId) ||
          request.senderData.skillsToTeach.some(skill => skill._id === this.localSkillId)) &&
          request.status === "accepted"
        );
      });
    },

    pastRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return (
          (request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId) ||
          request.senderData.skillsToTeach.some(skill => skill._id === this.localSkillId)) &&
          ["rejected", "cancelled", "completed"].includes(request.status)
        );
      });
    },

  },

  async created() {
    this.isLoading = true;
    try {
      this.localSkillId = localStorage.getItem("strongSkillId");

      await this.fetchCurrentUser();
      await this.getAllSwapRequests();
      await this.listenForUserUpdates();
      await this.listenForSwapRequestUpdates();
    } catch (error) {
      console.error('Error creating swap request:', error);
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    ...mapActions('user', ['fetchCurrentUser', 'listenForUserUpdates']),
    ...mapActions('swapRequests', ['getAllSwapRequests', 'listenForSwapRequestUpdates']),

    async acceptSwapRequest(swapRequestId) {
      try {
        await this.$store.dispatch('swapRequests/acceptSwapRequest', {
          swapRequestId,
          chosenSkillToSwap: this.selectedSkillObject
        });
      } catch (error) {
        console.error('Error accepting swap request:', error);
      }
    },

    async rejectSwapRequest(swapRequestId) {
      try {
        await this.$store.dispatch('swapRequests/rejectSwapRequest', swapRequestId);
      } catch (error) {
        console.error('Error rejecting swap request:', error);
      }
    },

    async openChat(senderId, requestId, status) {
      if (status === 'rejected' || status === 'pending') {
        console.log('Chat cannot be opened due to the current status of the deal.');
        return;
      }
      try {
        // Создать новый чат
        await this.$store.dispatch("chat/createOrGetCurrentChat", {
          receiverId: this.currentUser._id,
          senderId,
          swapRequestId: requestId,
        });
        await this.$store.dispatch('deal/createOrGetCurrentDeal', {
          participants: this.getCurrentChat.participants,
          chatId: this.getCurrentChat._id,
          swapRequestId: this.getCurrentChat.swapRequestId,
        });
        const chat = this.getCurrentChat;
        localStorage.setItem("chatId", chat._id);
        this.$router.push(`/${chat._id}`);
      } catch (error) {
        console.error("Error opening chat:", error);
      }
    },
  },
};
</script>
