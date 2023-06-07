<template>
  <div>
    <div class="skill-chips" v-for="(skill, skillIndex) in skills" :key="skillIndex">
      <v-chip :disabled="disabled" :input-value="isSkillSelected(skill)" @click="$emit('skillToggled', skill)">{{ skill }}</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    skills: Array,
    selectedSkills: Array,
    disabled: Boolean
  },
  methods: {
    isSkillSelected(skill) {
      return this.selectedSkills.includes(skill);
    },
  }
};
</script>
<style scoped>
.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.v-chip {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
}
</style>