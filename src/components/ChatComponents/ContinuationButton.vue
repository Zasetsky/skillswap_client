<template>
  <v-tooltip top color="black">
    <template v-slot:activator="{ on }">
      <v-btn
        color="white"
        v-on="on"
        :disabled="disabled"
        @click="proposeContinuation"
      >
        <v-icon
          color="success"
          class="cursor-pointer"
        >
          mdi-arrow-right-bold-box-outline
        </v-icon>
      </v-btn>
    </template>
    <span>Предложить продолжение</span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    proposeContinuation() {
      this.$emit("propose-continuation");
    },
  },
};
</script>
<style scoped>
/* add any custom styles for the component here */
</style>