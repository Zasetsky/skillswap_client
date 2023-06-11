<template>
  <v-container v-if="isLoading">
    Загрузка...
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <div class="header-container">
          <h2>{{ (weakSkillObject.skill ?? '') || (weakSkillObject.category ?? '') || (weakSkillObject.subCategory ?? '') }}</h2>

          <v-btn v-if="getFilteredActiveRequests(localSkillId).length === 0" color="primary" @click="goToMatchingUsers">
            Найти совпадения
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <active-requests
        :disabled="getIsBusy"
        :localSkillId="localSkillId"
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
      isLoading: true,
    }
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("chat", ["getCurrentChat", "getIsBusy"]),
    ...mapGetters("swapRequests", ["getSwapRequests", "getFilteredActiveRequests"]),

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
    this.isLoading = true;
    try {
      this.localSkillId = this.$route.query.weakSkillId;

      await this.$store.dispatch("swapRequests/fetchAllSwapRequests");
      await this.$store.dispatch("chat/switchPartnerIsBusy");
      } catch (error) {
        console.error('Error creating swap request:', error);
    } finally {
      this.isLoading = false;
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