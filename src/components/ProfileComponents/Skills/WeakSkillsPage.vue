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
      />
      <past-requests/>
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