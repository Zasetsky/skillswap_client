<template>
    <v-card @click="$emit('open-chat', chat.partnerId, chat.swapRequestId)">
      <v-card-title>
        <span>{{ chat.partner }}</span>
      </v-card-title>
      <v-card-subtitle>
        <span v-if="isSender && chat.skillToLearn"><b>Учиться: {{ chat.skillToLearn.skill }}</b></span>
        <span v-else-if="chat.skillToLearn"><b>Учить: {{ chat.skillToLearn.skill }}</b></span><br>
        <span v-if="isSender">Учить: {{ chat.skillToTeach && chat.skillToTeach.skill }}</span>
        <span v-else>Учиться: {{ chat.skillToTeach && chat.skillToTeach.skill }}</span>
      </v-card-subtitle>
      <v-card-text>
        <span>{{ chat.message }}</span>
        <div style="margin-left: 20px;">{{ chat.messageTime }}</div>
      </v-card-text>
      <v-card-text>
        <div v-if="isReceived">
          <v-chip color="primary" small>Принятый</v-chip>
        </div>
        <div v-else>
          <v-chip color="secondary" small>Отправленный</v-chip>
        </div>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true,
    },
    isSender: {
      type: Boolean,
      required: true,
    },
    isReceived: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
</style>
