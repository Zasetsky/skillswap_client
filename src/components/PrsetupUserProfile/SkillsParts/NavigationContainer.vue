<template>
  <v-container class="navigation-container">
    <v-row>
      <v-btn class="navigation-button" outlined color="primary" @click="$emit('resetThemeCategorySubcategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedTheme.theme }}
      </v-btn>
      <v-btn v-if="selectedCategory" class="navigation-button" outlined color="primary" @click="$emit('resetCategorySubcategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedCategory.category }}
      </v-btn>
      <v-btn v-if="selectedSubcategory" class="navigation-button" outlined color="primary" @click="$emit('resetSubcategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedSubcategory.subcategory }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    selectedTheme: Object,
    selectedCategory: Object,
    selectedSubcategory: Object,
  }
};
</script>
<style scoped>
.navigation-container {
  margin-bottom: 1.5rem;
}
.navigation-button {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
}
</style>