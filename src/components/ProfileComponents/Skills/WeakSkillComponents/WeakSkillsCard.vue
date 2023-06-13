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

      <template v-if="request.receiverData && request.status !== 'rejected'">
        <strong>Навык, который вы преподаёте:</strong> {{ request.status === 'pending' ? '???' : (request.receiverData.skillsToTeach[0]?.skill ?? '') }}<br>
      </template>

      <template v-if="isPast">
        <strong>Статус запроса:</strong> {{ request.status }}
      </template>
      
      <v-btn
        v-if="request.status === 'pending'"
        class="btn mt-4"
        color="primary"
        @click.stop="cancelSwapRequest"
      >
        Отменить запрос
      </v-btn>

      <slot></slot>
    </v-card-text>
  </v-card>
</template>
  
<script>
import { mapGetters } from "vuex";
import chatMixin from '@/mixins/chatMixin.js';

export default {
  mixins: [chatMixin],

  props: {
    request: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),

    isPast() {
      const validStauses = ["completed", "rejected", "cancelled"].includes(this.request.status);
      return validStauses;
    },

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
      let receiverId, senderId, requestId, chatId, status;

      if (this.currentUser._id === this.request.senderId) {
        // Current user is the sender of the request
        receiverId = this.request.receiverId;
        senderId = this.request.senderId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      } else {
        // Current user is the receiver, so we want the sender's ID
        receiverId = this.request.senderId;
        senderId = this.request.receiverId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      }
      
      this.openOrCreateChat(receiverId, senderId, requestId, chatId, status);
    },

    async cancelSwapRequest() {
      const swapRequestId = this.request._id;
      try {
        await this.$store.dispatch("swapRequests/deleteSwapRequest", swapRequestId);
        await this.$store.dispatch("user/fetchCurrentUser");
      } catch (error) {
        console.error('Error creating swap request:', error);
      }
    },
  }
};
</script>
<style scoped>
.skill_card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill_card_pending {
  pointer-events: none;
}

.btn {
  pointer-events: auto;
}

.skill_card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>