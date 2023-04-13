<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="header-container">
          <h2>{{ weakSkillObject.skill || weakSkillObject.category || weakSkillObject.subCategory }}</h2>
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
            <strong>Хочет изучить:</strong> {{ sentRequest.receiverData.skillsToTeach[0].skill }}<br>
            <strong>Хочу изучить:</strong> {{ sentRequest.receiverData.skillsToLearn[0].skill }}<br>

            <v-btn
              v-if="sentRequest.status === 'accepted'"
              class="mt-4"
              color="primary"
              @click="openChat(sentRequest.receiverData.id)"
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

    weakSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const skillId = this.localSkillId;
      return this.currentUser.skillsToLearn.find(skill => skill._id === skillId) || {};
    },

    filteredSentRequests() {
      if (!this.currentUser || !this.currentUser.swapRequests) {
        return [];
      }
      return this.currentUser.swapRequests.filter(request => {
        return request.receiverData.skillsToLearn.some(skill => skill._id === this.localSkillId);
      });
    },
  },

  async created() {
    try {
        await this.fetchCurrentUser();
        this.localSkillId = localStorage.getItem("weakSkillId");
        console.log(this.filteredSentRequests);
      } catch (error) {
        console.error('Error creating swap request:', error);
      }
  },

  methods: {
    ...mapActions("swapRequests", ["deleteSwapRequest"]),
    ...mapActions('user', ['fetchCurrentUser']),
    ...mapActions('chat', ['createChat']),

    async cancelSwapRequest(swapRequestId) {
      console.log(this.localSkillId);
      try {
        await this.deleteSwapRequest(swapRequestId);
        await this.fetchCurrentUser();
      } catch (error) {
        console.error('Error creating swap request:', error);
      }
    },

    async openChat(senderId) {
      try {
        await this.createChat({
          senderId,
          skillId: this.localSkillId,
        });
        const chat = this.getCurrentChat;
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
};
</script>
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>