<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>{{ skillObject.skill || skillObject.category || skillObject.subCategory }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <h3>Активный запрос</h3>
        <v-card v-for="sentRequest in filteredSentRequests" :key="sentRequest._id" class="mb-4">
          <v-card-text>
              <v-avatar size="64" class="mb-2">
                <img :src="sentRequest.avatar || 'https://via.placeholder.com/64'" alt="User avatar">
              </v-avatar>
              
              <strong>Имя:</strong> {{ sentRequest.firstName }} {{ sentRequest.lastName }}<br>
              <strong>Описание:</strong> {{ sentRequest.bio }}<br>

              <strong>Хочу изучить:</strong> {{ sentRequest.skillToLearn }}<br>

              <v-btn class="mt-4" color="primary" @click="cancelSwapRequest(sentRequest._id)">
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
      skillObject: null
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    sentRequests() {
      if (!this.currentUser.swapRequests || !this.skillObject) {
        return [];
      }
      return this.currentUser.swapRequests
        .map(request => ({
          ...request.receiverData,
          skillToLearn: request.receiverData.skillsToLearn && request.receiverData.skillsToLearn[0] ? request.receiverData.skillsToLearn[0].skill : '',
        }))
        .filter(receiverData => receiverData.id && this.skillObject.isInProcess);
    },
    filteredSentRequests() {
      if (!this.sentRequests) {
        return [];
      }
      return this.sentRequests.filter(request => request.id);
    },
  },

  created() {
    const storedSkillObject = localStorage.getItem("skillObject");

    if (storedSkillObject) {
      this.skillObject = JSON.parse(storedSkillObject);
    } else {
      this.$router.push({ name: "SkillsListPage" });
    }
  },

  methods: {
    ...mapActions("swapRequests", ["deleteSwapRequest"]),
    ...mapActions('user', ['fetchCurrentUser']),

    async cancelSwapRequest() {
      try {
        await this.deleteSwapRequest(this.swapRequestId);
        await this.toggleIsInProcessSkillToLearn(this.skillObject._id);
        await this.fetchCurrentUser();
      } catch (error) {
          console.error('Error creating swap request:', error);
      }
    }
  },
  mounted() {
    console.log('sent: ', this.sentRequests);
  }
};
</script>
