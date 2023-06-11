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
        />

        <received-requests />
      </v-col>
      <v-col cols="12" sm="6">
        <past-requests />
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
};
</script>