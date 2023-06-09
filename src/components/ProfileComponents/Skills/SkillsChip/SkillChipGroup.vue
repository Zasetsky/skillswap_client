<template>
  <div>
    <v-chip-group>
      <v-chip
        label color="primary"
        v-for="(skill, index) in strongSkills"
        :key="index"
        @click="handleOnStrongSkillClick(skill._id)"
        class="swap-request-chip"
      >
        {{ skill.skill || skill.category || skill.subCategory }}
      </v-chip>
    </v-chip-group>
    <v-chip-group>
      <v-chip
        label
        :color="'secondary'"
        v-for="(skill, index) in weakSkills"
        :key="index"
        @click="handleOnWeakSkillClick(skill._id)"
      >
        {{ skill.skill || skill.category || skill.subCategory }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {  
  computed: {
    ...mapGetters("auth", ["currentUser"]),

    strongSkills() {
      if (!this.currentUser || !this.currentUser.skillsToTeach.length)
        return "NaN";
      return this.currentUser.skillsToTeach;
    },

    weakSkills() {
      if (!this.currentUser || !this.currentUser.skillsToLearn.length)
        return "NaN";
      return this.currentUser.skillsToLearn;
    },
  },

  methods: {
    handleOnWeakSkillClick(skill) {
      localStorage.setItem("weakSkillId", skill);
      this.$router.push({ name: "WeakSkillsPage" });
    },

    handleOnStrongSkillClick(skill) {
      localStorage.setItem("strongSkillId", skill);
      this.$router.push({ name: "StrongSkillsPage" });
    }
  },
}
</script>
<style scoped>
.swap-request-chip {
  position: relative;
  overflow: visible;
}
</style>