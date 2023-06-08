<template>
    <div>
      <v-card v-for="user in getMatchingUsers" :key="user._id" class="mb-4" @click="openUserProfile(user._id)">
        <div style="display: flex; justify-content: space-between;">
          <v-card-title>{{ user.firstname }} {{ user.lastname }}</v-card-title>
          <v-card-title>{{ findSkillLevel(user.skillsToTeach) }}</v-card-title>
        </div>
        <v-card-text>
          <div></div>
          <div>Рейтинг навыка: {{ findSkillRating(user.skillsToTeach) }}</div>
          <div>Рейтинг надежности: {{ user.reliabilityRating }}</div>
          <div>Рейтинг лояльности: {{ user.loyaltyRating }}</div>
          <div>Карма: {{ user.karma }}</div>
        </v-card-text>
      </v-card>
    </div>
  </template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("matching", ["getMatchingUsers"]),
    ...mapGetters('matching', ['getSelectedSkill']),
  },

  methods: {
    ...mapActions("user", ["fetchUserProfile"]),

    findSkillLevel(skillsToTeach) {
      const skill = skillsToTeach.find(skill => skill._id === this.getSelectedSkill._id);
      const skillLevel = skill ? skill.level : 'unknown';

      const levelTranslations = {
        beginner: 'начинающий',
        intermediate: 'средний',
        advanced: 'продвинутый',
        unknown: 'неизвестный',
      };

      return levelTranslations[skillLevel];
    },

    findSkillRating(skillsToTeach) {
      const skill = skillsToTeach.find(skill => skill._id === this.getSelectedSkill._id);
      return skill ? skill.rating : 'unknown';
    },

    async openUserProfile(userId) {
      this.$router.push({ 
        name: 'UserProfile', 
        params: { userId },
        query: { skillToLearnId: this.getSelectedSkill._id } 
      });
      await this.fetchUserProfile(userId);
    }
  },
};
</script>
<style scoped>

</style>