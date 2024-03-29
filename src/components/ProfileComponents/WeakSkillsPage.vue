<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="header-container">
          <h2>{{ (weakSkillObject.skill ?? '') || (weakSkillObject.category ?? '') || (weakSkillObject.subCategory ?? '') }}</h2>

          <v-btn v-if="filteredActiveRequests.length === 0" color="primary" @click="goToMatchingUsers">
            Найти совпадения
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <h3>Активный запрос</h3>
        <skill-card
          v-for="sentRequest in filteredActiveRequests"
          :key="sentRequest._id"
          :sentRequest="sentRequest"
          @open-chat="openChat"
        >
          <v-btn
            v-if="sentRequest.status !== 'accepted'"
            class="mt-4"
            color="primary"
            @click="cancelSwapRequest(sentRequest._id)"
          >
            Отменить запрос
          </v-btn>
        </skill-card>
        <v-card v-if="filteredActiveRequests.length === 0">
          <v-card-text>
            Здесь будет информация об активных запросов этого навыка
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <h3>История запросов и выполненных сделок</h3>
        <skill-card
          v-for="pastRequest in filteredPastRequests"
          :key="pastRequest._id"
          :sentRequest="pastRequest"
          :is-past-request="true"
          @open-chat="openChat"
        ></skill-card>
        <v-card v-if="filteredPastRequests.length === 0">
          <v-card-text>Здесь будет информация об активной сделке</v-card-text>
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

    filteredActiveRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return (
          request.receiverData.skillsToLearn.some(skill => skill._id === this.localSkillId) &&
          request.senderId === this.currentUser._id &&
          (request.status === "pending" || request.status === "accepted")
        );
      });
    },

    filteredPastRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }
      return this.getSwapRequests.filter(request => {
        return (
          request.receiverData.skillsToLearn.some(skill => skill._id === this.localSkillId) &&
          request.senderId === this.currentUser._id &&
          (request.status !== "pending" && request.status !== "accepted")
        );
      });
    },
  },

  methods: {
    ...mapActions('swapRequests', ['deleteSwapRequest', 'getAllSwapRequests']),
    ...mapActions('user', ['fetchCurrentUser']),

    async cancelSwapRequest(swapRequestId) {
      try {
        await this.deleteSwapRequest(swapRequestId);
        await this.fetchCurrentUser();
      } catch (error) {
        console.error('Error creating swap request:', error);
      }
    },

    async openChat(receiverId, requestId) {
      try {
        await this.$store.dispatch("chat/createOrGetCurrentChat", {
          receiverId: receiverId,
          senderId: this.currentUser._id,
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