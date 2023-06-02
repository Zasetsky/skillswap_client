<template>
  <v-btn
    v-if="isConfirmButtonVisible"
    color="blue darken-1"
    text
    @click="emitConfirmDeal"
  >
    Подтвердить
  </v-btn>
</template>

<script>
export default {
  props: {
    isFormChanged: {
      type: Boolean,
      default: false,
    },
    isConfirmButtonVisible: {
      type: Boolean,
      default: false,
    },
  },


  methods: {
    emitConfirmDeal() {
      this.$emit("confirm-deal");
    },
  }
};
</script>
