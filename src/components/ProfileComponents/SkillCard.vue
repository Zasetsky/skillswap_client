<template>
  <v-card
    :key="request._id || sentRequest._id"
    class="mb-4 skill_card"
    :class="{skill_card_pending: request.status === 'pending' || sentRequest.status === 'pending' || request.status === 'rejected' || sentRequest.status === 'rejected'}"
    @click="handleClick"
  >
    <v-card-text>
      <v-avatar size="64" class="mb-2">
        <img :src="getAvatarUrl" alt="User avatar">
      </v-avatar>

      <strong>Имя:</strong> {{ getName }}<br>
      <strong>Описание:</strong> {{ getDescription }}<br>

      <template v-if="request.senderData && request.senderData.skillsToLearn">
        <strong>Навыки для обмена:</strong>
          <span v-for="(skillToTeach, index) in request.senderData.skillsToTeach" :key="index">
            {{ skillToTeach.skill }}<span v-if="index < request.senderData.skillsToTeach.length - 1">, </span>
          </span><br>
      </template>
      <template v-else-if="sentRequest.receiverData && sentRequest.status !== 'rejected'">
        <strong>Навык для обмена:</strong> {{ sentRequest.status === 'pending' ? '???' : (sentRequest.receiverData.skillsToTeach[0]?.skill ?? '') }}<br>
      </template>

      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    request: {
      type: Object,
      default: () => ({}),
    },
    sentRequest: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),

    currentUserId() {
      return this.currentUser._id;
    },

    senderData() {
      return this.request.senderData || this.sentRequest.senderData;
    },

    receiverData() {
      return this.request.receiverData || this.sentRequest.receiverData;
    },

    getUserData() {
      if (this.currentUserId !== this.request.senderId && this.currentUserId !== this.sentRequest.senderId) {
        return this.senderData;
      } else {
        return this.receiverData;
      }
    },

    getAvatarUrl() {
      return this.getUserData?.avatar || 'https://via.placeholder.com/64';
    },

    getName() {
      const firstname = this.getUserData?.firstname || '';
      const lastname = this.getUserData?.lastname || '';
      return `${firstname} ${lastname}`;
    },

    getDescription() {
      return this.getUserData?.bio || '';
    },
  },

  methods: {
    handleClick() {
      let userId, requestId, status, chatId;
      if (this.currentUser._id === this.request.senderId) {
        // Current user is the sender of the request
        userId = this.request.receiverId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      } else if (this.currentUser._id === this.sentRequest.senderId) {
        // Current user is the sender of the sentRequest
        userId = this.sentRequest.receiverId;
        requestId = this.sentRequest._id;
        chatId = this.sentRequest.chatId;
        status = this.sentRequest.status;
      } else {
        // Current user is the receiver, so we want the sender's ID
        userId = this.request.senderId || this.sentRequest.senderId;
        requestId = this.request._id || this.sentRequest._id;
        chatId = this.request.chatId || this.sentRequest.chatId;
        status = this.request.status || this.sentRequest.status;
      }
      
      this.$emit('open-chat', userId, requestId, chatId, status);
    },
  }
};
</script>
<style>
.skill_card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill_card_pending {
  cursor: default;
}

.skill_card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>