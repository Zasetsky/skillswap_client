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
      <active-requests
        :disabled="getIsBusy"
        :filteredActiveRequests="filteredActiveRequests"
        @cancel-request="emitCancelSwapRequest"
        @open-chat="openChat"
      />
      <past-requests @open-chat="openChat" />
    </v-row>
  </v-container>
</template>

<script>
import ActiveRequests from "./WeakSkillComponents/ActiveRequests.vue";
import PastRequests from "./WeakSkillComponents/PastRequests.vue";

import { mapGetters } from "vuex";

export default {
  components: {
      ActiveRequests,
      PastRequests
  },

  data() {
    return {
      localSkillId: '',
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("chat", ["getIsBusy"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

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

    weakSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const skillId = this.localSkillId;
      const weakSkill = this.currentUser.skillsToLearn.find(skill => skill._id === skillId) || {};

      return weakSkill;
    },
  },

  methods: {
    emitCancelSwapRequest() {
      this.$emit('cancel-request');
    },

    async createChat(receiverId, senderId, requestId) {
      try {
        await this.$store.dispatch("chat/createChat", {
          receiverId,
          senderId,
          requestId,
        });
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },

    async createDeal(receiverId, senderId, requestId, chatId) {
      try {
        await this.$store.dispatch("deal/createDeal", {
          participants: [receiverId, senderId],
          chatId,
          requestId,
        });
      } catch (error) {
        console.error("Error creating deal:", error);
      }
    },

    async openChat(receiverId, senderId, requestId, chatId, status) {
      if (status === 'rejected' || status === 'pending') {
        return;
      }

      if (this.getIsBusy && !chatId) {
        console.log('Is BUSY!!!');
        return;
      }

      let localChatId;

      if (!chatId) {
        await this.createChat(receiverId, senderId, requestId);
        localChatId = this.getCurrentChat._id;

        await this.createDeal(receiverId, senderId, requestId, localChatId);
      } else {
        await this.$store.dispatch("chat/fetchCurrentChat", chatId);
        localChatId = chatId;
      }

      localStorage.setItem("chatId", localChatId);
      this.$router.push(`/${localChatId}`);
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

      await this.$store.dispatch("user/fetchCurrentUser");
      await this.$store.dispatch("swapRequests/fetchAllSwapRequests");
      await this.$store.dispatch("chat/switchPartnerIsBusy");
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