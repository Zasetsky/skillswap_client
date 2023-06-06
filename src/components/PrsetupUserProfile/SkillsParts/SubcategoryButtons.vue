<template>
  <div>
    <div class="subcategory-buttons" v-for="(subcategory, subcategoryIndex) in subcategories" :key="subcategoryIndex">
      <v-btn class="subcategory-button" @click="selectSubcategory(subcategory)">{{ subcategory.subcategory }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subcategories: Array,
  },
  methods: {
    selectSubcategory(subcategory) {
      this.$emit('subcategory-selected', subcategory);
    }
  }
};
</script>
<style scoped>
.subcategory-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.subcategory-button {
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
}
</style>