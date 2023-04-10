<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>{{ strongSkillObject.skill || strongSkillObject.category || strongSkillObject.subCategory }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <h3>Полученные запросы на обмен</h3>
          <v-card v-for="receivedRequest in filteredReceivedRequests" :key="receivedRequest._id" class="mb-4">
            <v-card-text>
              <v-avatar size="64" class="mb-2">
                <img :src="receivedRequest.senderData.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
              </v-avatar>
  
              <strong>Имя:</strong> {{ receivedRequest.senderData.firstName }} {{ receivedRequest.senderData.lastName }}<br>
              <strong>Описание:</strong> {{ receivedRequest.senderData.bio }}<br>
  
              <strong>Хочу изучить:</strong> {{ receivedRequest.senderData.skillsToLearn[0].skill }}<br>
  
              <v-btn class="mt-4" color="primary" @click="acceptSwapRequest(receivedRequest._id)">
                Принять запрос
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
          <h3>История запросов и выполненных сделок</h3>
          <v-card>
            <v-card-text>Здесь будет информация об активной сделке</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h3>График прокачивания навыка</h3>
          <!-- Здесь будет график прокачивания навыка -->
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
          return request.senderData.skillsToLearn.some(skill => skill._id === this.localSkillId);
        });
      },
    },
  
    async created() {
      try {
          await this.fetchCurrentUser();
          this.localSkillId = localStorage.getItem("strongSkillId");
          console.log(this.filteredReceivedRequests);
        } catch (error) {
          console.error('Error creating swap request:', error);
        }
    },

    methods: {
        ...mapActions("swapRequests", ["deleteSwapRequest", "acceptSwapRequest"]),
        ...mapActions('user', ['fetchCurrentUser']),
        ...mapActions('skills', ['toggleIsInProcessSkillToLearn']),

        async acceptSwapRequest(swapRequestId) {
        console.log(this.localSkillId);
        try {
            await this.acceptSwapRequest(swapRequestId);
            await this.fetchCurrentUser();
        } catch (error) {
            console.error('Error accepting swap request:', error);
        }
        }
    },
};
</script>
  