<template>
  <v-container class="navigation-container">
    <v-row>
      <v-btn class="navigation-button" outlined color="primary" @click="$emit('resetThemeCategorySubCategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedTheme.theme }}
      </v-btn>
      <v-btn v-if="selectedCategory" class="navigation-button" outlined color="primary" @click="$emit('resetCategorySubCategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedCategory.category }}
      </v-btn>
      <v-btn v-if="selectedSubCategory" class="navigation-button" outlined color="primary" @click="$emit('resetSubCategory')">
        <v-icon left>mdi-arrow-left</v-icon>
        {{ selectedSubCategory.subCategory }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    selectedTheme: Object,
    selectedCategory: Object,
    selectedSubCategory: Object,
  }
};
</script>
