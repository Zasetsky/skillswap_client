<template>
  <div>
    <div class="category-buttons" v-for="(category, categoryIndex) in categories" :key="categoryIndex">
      <v-btn :disabled="disabled" class="category-button" @click="selectCategory(category)">{{ category.category }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
    disabled: Boolean
  },
  methods: {
    selectCategory(category) {
      this.$emit('category-selected', category);
    }
  }
};
</script>
<style scoped>
.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.category-button {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
}
</style>