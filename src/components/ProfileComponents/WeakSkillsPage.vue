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
          @open-chat="openChat"
        >
          <strong>Статус:</strong> {{ pastRequest.status }}
        </skill-card>
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
      const weakSkill = this.currentUser.skillsToLearn.find(skill => skill._id === skillId) || {};

      return weakSkill;
    },

    filteredActiveRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const currentActiveSkill = this.currentUser.skillsToLearn.find(
        (skill) => skill._id === this.localSkillId && skill.isActive
      );

      const filteredRequests = this.getSwapRequests.filter((request) => {
        return (
          (request.receiverData.skillsToLearn.some((skill) => skill._id === this.localSkillId) ||
          request.receiverData.skillsToTeach.some((skill) => skill._id === this.localSkillId)) &&
          currentActiveSkill &&
          (request.status === "pending" || request.status === "accepted")
        );
      });

      return filteredRequests;
    },

    filteredPastRequests() {
      if (!this.currentUser || !this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const currentNotActiveSkill = this.currentUser.skillsToLearn.find(
        (skill) => skill._id === this.localSkillId && !skill.isActive
      );

      const filteredRequests = this.getSwapRequests.filter(request => {
        return (
          (request.receiverData.skillsToLearn.some((skill) => skill._id === this.localSkillId) ||
          request.receiverData.skillsToTeach.some((skill) => skill._id === this.localSkillId)) &&
          currentNotActiveSkill &&
          (request.status !== "pending" || request.status !== "accepted")
        );
      });
  
      return filteredRequests;
    },
  },

  methods: {
    ...mapActions('swapRequests', ['deleteSwapRequest', 'getAllSwapRequests', 'listenForSwapRequestUpdates']),
    ...mapActions('user', ['fetchCurrentUser', 'listenForUserUpdates']),

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
      this.localSkillId = localStorage.getItem("weakSkillId");

      await this.fetchCurrentUser();
      await this.getAllSwapRequests();
      await this.listenForSwapRequestUpdates();
      await this.listenForUserUpdates();
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