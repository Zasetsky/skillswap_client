<template>
  <v-btn  @click="cancelDeal" color="error">
    Отменить сделку
  </v-btn>
</template>

<script>
export default {
  props: {
    isEnabled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    cancelDeal() {
      // emit an event to the parent component to handle cancelling the deal
      this.$emit("cancel-deal");
    },
  },
};
</script>

<style scoped>
/* add any custom styles for the component here */
</style>
