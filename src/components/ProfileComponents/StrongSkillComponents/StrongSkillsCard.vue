<template>
  <v-card
    :key="request._id"
    class="mb-4 skill_card"
    :class="{skill_card_pending: request.status === 'pending' || request.status === 'rejected'}"
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
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),

    senderData() {
      return this.request.senderData;
    },

    receiverData() {
      return this.request.receiverData;
    },

    getUserData() {
      if (this.currentUser._id !== this.request.senderId) {
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
      let senderId, requestId, status, chatId;

      if (this.currentUser._id === this.request.senderId) {
        // Current user is the sender of the request
        senderId = this.request.receiverId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      } else {
        // Current user is the receiver of the request
        senderId = this.request.senderId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      }
      
      this.$emit('open-chat', senderId, requestId, chatId, status);
    },
  }
};
</script>
