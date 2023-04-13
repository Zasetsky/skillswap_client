<template>
    <div>
      <v-text-field
        label="New message"
        v-model="newMessage"
        @keyup.enter="sendNewMessage"
        outlined
        single-line
        dense
        full-width
      ></v-text-field>
      <v-btn color="primary" @click="sendNewMessage">Send</v-btn>
    </div>
  </template>
  
  
<script>
export default {
    data() {
        return {
            newMessage: '',
        };
    },
  
    methods: {
        async sendNewMessage() {
            if (!this.newMessage) return;
            this.$emit('send-message', this.newMessage);
            this.newMessage = '';
        },
    },
};
</script>
  