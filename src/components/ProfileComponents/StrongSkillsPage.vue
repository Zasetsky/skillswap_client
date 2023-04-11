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

              <strong>Хочу изучить:</strong> {{ acceptedRequest.senderData.skillsToLearn[0].skill }}<br>
              <strong>Навык для обмена:</strong> {{ acceptedRequest.senderData.skillsToTeach[0].skill }}<br>

              <v-btn class="mt-4" color="primary">
                Открыть чат сделки
              </v-btn>
            </v-card-text>
          </v-card>
          <v-card v-if="acceptedRequests.length === 0">
            <v-card-text>
              Здесь будет информация об принятых запросах и активных сделок
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
  
              <strong>Хочу изучить:</strong> {{ receivedRequest.senderData.skillsToLearn[0].skill }}<br>
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
                @click="acceptSwapRequest(receivedRequest._id, receivedRequest.senderData.id, selectedSkillObject)"
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
          <v-card>
            <v-card-text>Здесь будет информация о прошлых запросах</v-card-text>
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
  
      strongSkillObject() {
        if (!this.currentUser) {
          return {};
        }
  
        const skillId = this.localSkillId;
        return this.currentUser.skillsToTeach.find(skill => skill._id === skillId) || {};
      },
  
      filteredReceivedRequests() {
        if (!this.currentUser || !this.currentUser.swapRequests) {
          return [];
        }
        return this.currentUser.swapRequests.filter(request => {
          return request.status === "pending" && request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId);
        });
      },

      acceptedRequests() {
        if (!this.currentUser || !this.currentUser.swapRequests) {
          return [];
        }
        return this.currentUser.swapRequests.filter(request => {
          return (request.status === "accepted" || request.status === "active") && request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId);
        });
      },

    },
  
    async created() {
      try {
          await this.fetchCurrentUser();
          this.localSkillId = localStorage.getItem("strongSkillId");
          console.log(this.acceptedRequests);
        } catch (error) {
          console.error('Error creating swap request:', error);
        }
    },

    methods: {
        ...mapActions("swapRequests", ["deleteSwapRequest"]),
        ...mapActions('user', ['fetchCurrentUser']),
        ...mapActions('skills', ['toggleIsInProcessSkillToLearn']),

        async acceptSwapRequest(swapRequestId, senderId, selectedSkill) {
          try {
            await this.$store.dispatch('swapRequests/acceptSwapRequest', {
              currentUserId: this.currentUser._id,
              requestId: swapRequestId,
              userId: senderId,
              skillToTeach: selectedSkill,
            });
            await this.fetchCurrentUser();
          } catch (error) {
            console.error('Error accepting swap request:', error);
          }
        },

        async rejectSwapRequest(swapRequestId) {
          try {
            await this.deleteSwapRequest(swapRequestId);
            await this.fetchCurrentUser();
          } catch (error) {
            console.error('Error rejecting swap request:', error);
          }
      },
    }
};
</script>
  