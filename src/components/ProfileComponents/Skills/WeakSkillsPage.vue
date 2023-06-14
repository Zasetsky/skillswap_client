<template>
  <v-container v-if="isLoading">
    Загрузка...
  </v-container>

  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <div class="header-container">
          <h2>{{ (weakSkillObject.skill ?? '') || (weakSkillObject.category ?? '') || (weakSkillObject.subCategory ?? '') }}</h2>
          <matching-button/>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <active-requests/>

        <sent-request/>
      </v-col>

      <v-col cols="12" sm="6">
        <past-requests/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActiveRequests from "./WeakSkillComponents/ActiveRequests.vue";
import SentRequest from "./WeakSkillComponents/SentRequest.vue";
import MatchingButton from "./WeakSkillComponents/MatchingButton.vue";
import PastRequests from "./WeakSkillComponents/PastRequests.vue";

import { mapGetters } from "vuex";


export default {
  components: {
    ActiveRequests,
    PastRequests,
    MatchingButton,
    SentRequest
},

  data() {
    return {
      isLoading: true,
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),

    weakSkillObject() {
      if (!this.currentUser) {
        return {};
      }

      const skillId = this.$route.query.weakSkillId
      const weakSkill = this.currentUser.skillsToLearn.find(skill => skill._id === skillId) || {};

      return weakSkill;
    },
  },

  async created() {
    this.isLoading = true;
    try {
      await this.$store.dispatch("swapRequests/fetchAllSwapRequests");
      await this.$store.dispatch("chat/switchPartnerIsBusy");
      await this.$store.dispatch("review/fetchAllUserReviews");
      } catch (error) {
        console.error('Error creating swap request:', error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>