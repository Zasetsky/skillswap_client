<template>
  <div>
    <v-btn v-if="!isActiveCurrentSkill" color="primary" @click="goToMatchingUsers">
      Найти совпадения
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    
    isActiveCurrentSkill() {
      const localSkillId = this.$route.query.weakSkillId

      const currentActiveSkill = this.currentUser.skillsToLearn.find(
        (skill) => skill._id === localSkillId && skill.isActive
      );

      return currentActiveSkill;
    }
  },

  methods: {
    goToMatchingUsers() {
      this.$router.push({
        name: "MatchingUsers",
        query: { skillToLearnId: this.$route.query.weakSkillId },
      });
    },
  },
}
</script>

<style lang="">
  
</style>