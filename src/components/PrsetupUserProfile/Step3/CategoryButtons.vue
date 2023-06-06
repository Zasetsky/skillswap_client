<template>
  <div>
    <div class="category-buttons" v-for="(category, categoryIndex) in categories" :key="categoryIndex">
      <v-btn class="category-button" @click="selectCategory(category)">{{ category.category }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
  },
  methods: {
    selectCategory(category) {
      this.$emit('category-selected', category);
    }
  }
};
</script>
