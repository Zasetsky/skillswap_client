<template>
  <v-col cols="12" sm="6">
    <h3>Активный запрос</h3>
    <weak-skills-card
      v-for="request in filteredActiveRequests"
      :key="request._id"
      :class="{ 'disabled-component': disabled }"
      :request="request"
      @open-chat="emitOpenChat"
      @cancel-request="emitCancelSwapRequest"
    />

    <v-card v-if="filteredActiveRequests.length === 0">
      <v-card-text>
        Здесь будет информация об активных запросов этого навыка
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import WeakSkillsCard from "./WeakSkillsCard.vue";

export default {
  components: {
    WeakSkillsCard,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    filteredActiveRequests: {
      type: Array,
      required: true,
    },
  },

  methods: {
    emitOpenChat(receiverId, senderId, requestId, chatId, status) {
      this.$emit('open-chat', receiverId, senderId, requestId, chatId, status);
    },

    emitCancelSwapRequest() {
      this.$emit('cancel-request');
    },
  }
}
</script>
<style scoped>
.disabled-component {
  pointer-events: none;
  opacity: 0.5;
}
</style>