<template>
  <div v-if="selectedSkills.length > 0" class="selected-skills">
    <h4>Выбранные навыки:</h4>
    <div 
      v-for="(selectedSkill, index) in selectedSkills" 
      :key="index" 
      class="selected-skill"
    >
      <v-btn class="skill-details">
        <span>
          <template v-if="selectedSkill.theme !== 'Языки'">
            {{ selectedSkill.subcategory }} - {{ selectedSkill.skill }}
          </template>
          <template v-else>
            {{ selectedSkill.theme }} - {{ selectedSkill.category }}
          </template>
        </span>

        <v-select
          :items="levels"
          class="select"
          item-text="text"
          item-value="value"
          label="Уровень"
          v-model="selectedSkill.level"
        ></v-select>
      </v-btn>
      <v-icon class="delete-icon" @click="$emit('remove-skill', index)">mdi-delete</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedSkills: Array,
  },

  data() {
    return {
      levels: [
        { text: 'Начальный', value: 'beginner' },
        { text: 'Средний', value: 'intermediate' },
        { text: 'Продвинутый', value: 'advanced' },
      ],
    };
  },
};
</script>

<style scoped>
.selected-skills {
  margin-bottom: 1.5rem;
  pointer-events: none;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.selected-skill {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.delete-icon {
  margin-left: 15px;
  pointer-events: auto;
  color: red;
}

.delete-icon:hover {
  color: darkred;
}

.select {
  width: 200px;
  pointer-events: auto;
}
</style>
