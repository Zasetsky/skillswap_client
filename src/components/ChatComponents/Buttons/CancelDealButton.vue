<template>
  <v-tooltip  top color="black">
    <template v-slot:activator="{ on }">
      <v-btn
        color="white"
        v-on="on"
        :disabled="disabled"
        @click="cancelDeal"
      >
        <v-icon
          color="error"
          class="cursor-pointer"
        >
          mdi-cancel
        </v-icon>
      </v-btn>
    </template>
    <span>Отменить сделку</span>
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
    cancelDeal() {
      this.$emit("cancel-deal");
    },
  },
};
</script>

<style scoped>
/* add any custom styles for the component here */
</style>
