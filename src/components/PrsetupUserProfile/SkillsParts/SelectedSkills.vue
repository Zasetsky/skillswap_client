<template>
  <div v-if="selectedSkills.length > 0" class="selected-skills">
    <h4>Выбранные навыки:</h4>
    <v-btn v-for="(selectedSkill, index) in selectedSkills" :key="index" text @click="$emit('remove-skill', index)">
      <template v-if="selectedSkill.theme !== 'Языки'">
        {{ selectedSkill.subcategory }} - {{ selectedSkill.skill }}
      </template>
      <template v-else>
        {{ selectedSkill.theme }} - {{ selectedSkill.category }}
      </template>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    selectedSkills: Array,
  }
};
</script>
<style scoped>
.selected-skills {
  margin-bottom: 1.5rem;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

v-btn {
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  text-transform: none;
}
</style>