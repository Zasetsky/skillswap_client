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
