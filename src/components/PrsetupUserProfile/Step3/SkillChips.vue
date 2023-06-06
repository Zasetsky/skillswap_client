<template>
  <div>
    <div class="skill-chips" v-for="(skill, skillIndex) in skills" :key="skillIndex">
      <v-chip :input-value="isSkillSelected(skill)" @click="$emit('skillToggled', skill)">{{ skill }}</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    skills: Array,
    selectedSkills: Array,
  },
  methods: {
    isSkillSelected(skill) {
      return this.selectedSkills.includes(skill);
    },
  }
};
</script>
