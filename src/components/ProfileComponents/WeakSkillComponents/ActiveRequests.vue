<template>
  <v-col cols="12" sm="6">
    <h3>Активный запрос</h3>
    <weak-skills-card
      v-for="request in filteredActiveRequests"
      :key="request._id"
      :request="request"
      @open-chat="emitOpenChat"
    >
      <v-btn
        v-if="request.status !== 'accepted'"
        class="mt-4"
        color="primary"
        @click.stop="emitCancelSwapRequest(request._id)"
      >
        Отменить запрос
      </v-btn>
    </weak-skills-card>
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
    filteredActiveRequests: {
      type: Array,
      required: true,
    },
  },

  methods: {
    emitOpenChat(receiverId, senderId, requestId, chatId, status) {
      this.$emit('open-chat', receiverId, senderId, requestId, chatId, status);
    },

    emitCancelSwapRequest(swapRequestId) {
      this.$emit('cancel-request', swapRequestId);
    },
  }
}
</script>
