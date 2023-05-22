<template>
  <v-text-field
    label="New message"
    v-model="newMessage"
    @keyup.enter="sendNewMessage"
    outlined
    single-line
    full-width
    dense
  >
    <v-icon
      slot="append"
      color="black"
      :class="{ hoverable: newMessage }"
      :disabled="!newMessage"
      @click="sendNewMessage"
    >
      mdi-send
    </v-icon>
  </v-text-field>
</template>

<script>
export default { 
  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      newMessage: this.value,
    };
  },

  watch: {
    value(newValue) {
      this.newMessage = newValue;
    },
    newMessage(newValue) {
      this.$emit("input", newValue);
    },
  },

  methods: {
    async sendNewMessage() {
      if (!this.newMessage) return;
      this.$emit("send-message", "text", this.newMessage);
      this.newMessage = "";
    },
  },
};
</script>

<style scoped>
  .hoverable:hover {
    color: blue !important;
    cursor: pointer;
  }
</style>
