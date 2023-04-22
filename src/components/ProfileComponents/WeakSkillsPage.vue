<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="header-container">
          <h2>{{ (weakSkillObject.skill ?? '') || (weakSkillObject.category ?? '') || (weakSkillObject.subCategory ?? '') }}</h2>

          <v-btn v-if="filteredSentRequests.length === 0" color="primary" @click="goToMatchingUsers">
            Найти совпадения
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <h3>Активный запрос</h3>
        <v-card v-for="sentRequest in filteredSentRequests" :key="sentRequest._id" class="mb-4">
          <v-card-text>
            <v-avatar size="64" class="mb-2">
              <img :src="sentRequest.receiverData.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
            </v-avatar>
            
            <strong>Имя:</strong> {{ sentRequest.receiverData.firstName }} {{ sentRequest.receiverData.lastName }}<br>
            <strong>Описание:</strong> {{ sentRequest.receiverData.bio }}<br>
            <strong>Навык для обмена:</strong> {{ sentRequest.status === 'pending' ? '???' : (sentRequest.receiverData.skillsToTeach[0]?.skill ?? '') }}<br>

            <v-btn
              v-if="sentRequest.status === 'accepted'"
              class="mt-4"
              color="primary"
              @click="openChat(sentRequest.receiverId, sentRequest._id)"
            >
              Открыть чат сделки
            </v-btn>
            <v-btn
              v-else
              class="mt-4"
              color="primary"
              @click="cancelSwapRequest(sentRequest._id)"
            >
              Отменить запрос
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card v-if="filteredSentRequests.length === 0">
          <v-card-text>
            Здесь будет информация об активных запросов этого навыка
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <h3>История запросов и выполненных сделок</h3>
        <v-card>
          <v-card-text>Здесь будет информация об активной сделке</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      localSkillId: '',
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    weakSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const skillId = this.localSkillId;
      return this.currentUser.skillsToLearn.find(skill => skill._id === skillId) || {};
    },

    filteredSentRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return request.receiverData.skillsToLearn.some(skill => skill._id === this.localSkillId)
          && request.senderId === this.currentUser._id;
      });
    },
  },

  methods: {
    ...mapActions('swapRequests', ['deleteSwapRequest', 'getAllSwapRequests']),
    ...mapActions('user', ['fetchCurrentUser']),
    ...mapActions('chat', ['createChat']),

    async cancelSwapRequest(swapRequestId) {
      try {
        await this.deleteSwapRequest(swapRequestId);
        await this.fetchCurrentUser();
      } catch (error) {
        console.error('Error creating swap request:', error);
      }
    },

    async openChat(senderId, acceptedRequestId) {
      try {
        await this.createChat({
          currentUserId: this.currentUser._id,
          senderId,
          swapRequestId: acceptedRequestId,
        });
        const chat = this.getCurrentChat;
        localStorage.setItem("chatId", chat._id);
        this.$router.push(`/${chat._id}`);
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    },

    goToMatchingUsers() {
      this.$router.push({
        name: "MatchingUsers",
        query: { skillToLearnId: this.localSkillId },
      });
    },
  },

  async mounted() {
    try {
        await this.fetchCurrentUser();
        await this.getAllSwapRequests();
        this.localSkillId = localStorage.getItem("weakSkillId");
      } catch (error) {
        console.error('Error creating swap request:', error);
    }
  }
};
</script>
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>