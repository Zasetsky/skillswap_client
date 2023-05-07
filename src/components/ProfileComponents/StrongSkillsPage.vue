<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>{{ strongSkillObject.skill || strongSkillObject.category || strongSkillObject.subCategory }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <h3>Принятые запросы и начатые сделки</h3>
          <v-card v-for="acceptedRequest in acceptedRequests" :key="acceptedRequest._id" class="mb-4">
            <v-card-text>
              <v-avatar size="64" class="mb-2">
                <img :src="acceptedRequest.senderData.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
              </v-avatar>

              <strong>Имя:</strong> {{ acceptedRequest.senderData.firstName }} {{ acceptedRequest.senderData.lastName }}<br>
              <strong>Описание:</strong> {{ acceptedRequest.senderData.bio }}<br>

              <strong>Хочет изучить:</strong> {{ acceptedRequest.senderData.skillsToLearn[0].skill }}<br>
              <strong>Навык для обмена:</strong> {{ acceptedRequest.senderData.skillsToTeach[0].skill }}<br>

              <v-btn 
                class="mt-4"
                color="primary"
                @click="openChat(acceptedRequest.senderId, acceptedRequest._id)"
              >
                Открыть чат сделки
              </v-btn>
            </v-card-text>
          </v-card>
          <v-card v-if="acceptedRequests.length === 0">
            <v-card-text>
              Здесь будет информация об принятых запросах и активных сделках этого навыка
            </v-card-text>
          </v-card>

          <h3>Полученные запросы на обмен</h3>
          <v-card v-for="receivedRequest in filteredReceivedRequests" :key="receivedRequest._id" class="mb-4">
            <v-card-text>
              <v-avatar size="64" class="mb-2">
                <img :src="receivedRequest.senderData.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
              </v-avatar>
  
              <strong>Имя:</strong> {{ receivedRequest.senderData.firstName }} {{ receivedRequest.senderData.lastName }}<br>
              <strong>Описание:</strong> {{ receivedRequest.senderData.bio }}<br>
  
              <strong>Хочет изучить:</strong> {{ receivedRequest.senderData.skillsToLearn[0].skill }}<br>
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
            </v-card-text>
          </v-card>
          <v-card v-if="filteredReceivedRequests.length === 0">
            <v-card-text>
              Здесь будет информация о полученных запросах на обмен этого навыка
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <h3>История запросов и сделок</h3>
          <v-card v-for="pastRequest in pastRequests" :key="pastRequest._id" class="mb-4">
            <v-card-text>
              <v-avatar size="64" class="mb-2">
                <img :src="pastRequest.senderData.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
              </v-avatar>

              <strong>Имя:</strong> {{ pastRequest.senderData.firstName }} {{ pastRequest.senderData.lastName }}<br>
              <strong>Описание:</strong> {{ pastRequest.senderData.bio }}<br>

              <strong>Хочтел изучить:</strong> {{ pastRequest.senderData.skillsToLearn[0].skill }}<br>
              <strong>Навыки для обмена:</strong>
              <span v-for="(skillToTeach, index) in pastRequest.senderData.skillsToTeach" :key="index">
                {{ skillToTeach.skill }}<span v-if="index < pastRequest.senderData.skillsToTeach.length - 1">, </span>
              </span><br>

              <strong>Статус:</strong> {{ pastRequest.status }}
            </v-card-text>
          </v-card>
          <v-card v-if="pastRequests.length === 0">
            <v-card-text>Здесь будет информация о прошлых запросах этого навыка</v-card-text>
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
        return (request.status === "accepted" || request.status === "active") && request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId) && request.receiverId === this.currentUser._id;
      });
    },

    pastRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return ["rejected", "cancelled", "completed"].includes(request.status) && request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId) && request.receiverId === this.currentUser._id;
      });
    },

  },

  async created() {
    try {
        await this.fetchCurrentUser();
        this.localSkillId = localStorage.getItem("strongSkillId");
        await this.getAllSwapRequests();
      } catch (error) {
        console.error('Error creating swap request:', error);
    }
  },

  methods: {
    ...mapActions('user', ['fetchCurrentUser']),
    ...mapActions('chat', ['createChat']),
    ...mapActions('swapRequests', ['getAllSwapRequests']),

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

    async openChat(senderId, requestId) {
      try {
        // Создать новый чат
        await this.$store.dispatch("chat/createChat", {
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
