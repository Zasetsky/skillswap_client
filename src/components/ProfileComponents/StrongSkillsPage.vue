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
          :disabled="getIsBusy"
          @open-chat="openChat"
        >
        </accepted-requests>

        <received-requests
          @accept-request="emitAcceptSwapRequest"
          @reject-request="emitRejectSwapRequest"
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
import PastRequests from "./StrongSkillComponents/PastRequests.vue";

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
    ...mapGetters("chat", ["getIsBusy"]),
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
      await this.$store.dispatch("swapRequests/fetchAllSwapRequests");
      await this.$store.dispatch("chat/switchPartnerIsBusy");
    } catch (error) {
      console.error('Error fetching swap request:', error);
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    emitAcceptSwapRequest() {
      this.$emit('accept-request');
    },

    emitRejectSwapRequest() {
      this.$emit('reject-request');
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
  },
};
</script>