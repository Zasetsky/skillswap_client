<template>
  <div v-if="selectedSkills.length > 0" class="selected-skills">
    <h4>Выбранные навыки:</h4>
    <v-btn v-for="(selectedSkill, index) in selectedSkills" :key="index" text @click="$emit('remove-skill', index)">
      <template v-if="selectedSkill.theme !== 'Языки'">
        {{ selectedSkill.subCategory }} - {{ selectedSkill.skill }}
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