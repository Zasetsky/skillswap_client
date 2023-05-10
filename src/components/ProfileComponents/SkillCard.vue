<template>
  <v-card
    :key="request._id || sentRequest._id"
    class="mb-4 skill_card"
    :class="{skill_card_pending: request.status === 'pending' || sentRequest.status === 'pending'}"
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
      <template v-else-if="sentRequest.receiverData">
        <strong>Навык для обмена:</strong> {{ sentRequest.status === 'pending' ? '???' : (sentRequest.receiverData.skillsToTeach[0]?.skill ?? '') }}<br>
      </template>

      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
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
    getAvatarUrl() {
      if (this.request.senderData) {
        return this.request.senderData.avatar || 'https://via.placeholder.com/64';
      } else if (this.sentRequest.receiverData) {
        return this.sentRequest.receiverData.avatar || 'https://via.placeholder.com/64';
      } else {
        return 'https://via.placeholder.com/64';
      }
    },
    getName() {
      const firstName = this.request.senderData?.firstName || this.sentRequest.receiverData?.firstName || '';
      const lastName = this.request.senderData?.lastName || this.sentRequest.receiverData?.lastName || '';
      return `${firstName} ${lastName}`;
    },
    getDescription() {
      return this.request.senderData?.bio || this.sentRequest.receiverData?.bio || '';
    },
  },
  methods: {
    handleClick() {
      this.$emit('open-chat', this.request.senderId || this.sentRequest.senderId, this.request._id || this.sentRequest._id);
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