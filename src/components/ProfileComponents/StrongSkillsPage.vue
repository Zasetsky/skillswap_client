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
        <accepted-requests
          @open-chat="openChat"
        >
        </accepted-requests>

        <received-requests
          @accept-request="acceptSwapRequest"
          @reject-request="rejectSwapRequest"
        >
        </received-requests>
      </v-col>
      <v-col cols="12" sm="6">
        <past-requests
          @open-chat="openChat"
        >
        </past-requests>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import AcceptedRequests from "./StrongSkillComponents/AcceptedRequests.vue";
import ReceivedRequests from "./StrongSkillComponents/ReceivedRequests.vue";
import PastRequests from "./StrongSkillComponents/PastRequestsHistory.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    AcceptedRequests,
    ReceivedRequests,
    PastRequests
  },

  data() {
    return {
      isLoading: true,
    }
  },
  
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("deal", ["getIsSending"]),
    ...mapGetters("chat", ["getCurrentChat"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    strongSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const localSkillId = localStorage.getItem("strongSkillId");
      return this.currentUser.skillsToTeach.find(skill => skill._id === localSkillId) || {};
    },
  },

  async created() {
    this.isLoading = true;
    try {
      await this.$store.dispatch("user/fetchCurrentUser");
      await this.$store.dispatch("swapRequests/fetchAllSwapRequests");
    } catch (error) {
      console.error('Error fetching swap request:', error);
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async acceptSwapRequest(swapRequestId, chosenSkillToSwap) {
      console.log(chosenSkillToSwap);
      try {
        await this.$store.dispatch('swapRequests/acceptSwapRequest', {
          swapRequestId,
          chosenSkillToSwap
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

    async createChat(senderId, requestId) {
      try {
        await this.$store.dispatch("chat/createChat", {
          receiverId: this.currentUser._id,
          senderId,
          requestId,
        });
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },

    async createDeal(senderId, requestId, chatId) {
      try {
        await this.$store.dispatch("deal/createDeal", {
          participants: [this.currentUser._id, senderId],
          chatId,
          requestId,
        });
      } catch (error) {
        console.error("Error creating deal:", error);
      }
    },

    async openChat(senderId, requestId, chatId, status) {
      if (status === 'rejected' || status === 'pending') {
        console.log('Chat cannot be opened due to the current status of the deal.');
        return;
      }

      if (this.getIsSending && !chatId) {
        console.log('Is BUSY!!!');
        return;
      }

      let localChatId;

      if (!chatId) {
        this.$store.dispatch("deal/toggleIsSending");

        await this.createChat(senderId, requestId);
        localChatId = this.getCurrentChat._id;

        await this.createDeal(senderId, requestId, localChatId);
      } else {
        await this.$store.dispatch("chat/fetchCurrentChat", chatId);
        localChatId = chatId;
      }

      localStorage.setItem("chatId", localChatId);
      this.$router.push(`/${localChatId}`);
    },
  },
};
</script>
<style>
.skill_card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill_card_pending {
  cursor: default;
}

.skill_card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>