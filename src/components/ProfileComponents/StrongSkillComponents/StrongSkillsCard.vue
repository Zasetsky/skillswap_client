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

      <div v-if="request.status === 'pending'">
        <v-select
          v-model="selectedSkill"
          :items="request.senderData.skillsToTeach"
          label="Выберите навык для обучения"
          class="actions mt-4"
          item-text="skill"
          item-value="item"
          return-object
        />

        <v-btn 
          class="actions mt-4"
          color="primary"
          :disabled="!selectedSkill?.skill"
          :style="!selectedSkill?.skill ? 'pointer-events: none' : ''"
          @click.stop="acceptSwapRequest"
        >
          Принять запрос
        </v-btn>
        <v-btn
          class="actions  mt-4 ml-2"
          color="error"
          @click.stop="rejectSwapRequest"
        >
          Отклонить запрос
        </v-btn>
      </div>

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

  data() {
    return {
      selectedSkill: null,
    }
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
      let receiverId, senderId, requestId, chatId, status;

      if (this.currentUser._id === this.request.senderId) {
        // Current user is the sender of the request
        receiverId = this.request.senderId;
        senderId = this.request.receiverId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      } else {
        // Current user is the receiver of the request
        receiverId = this.request.receiverId;
        senderId = this.request.senderId;
        requestId = this.request._id;
        chatId = this.request.chatId;
        status = this.request.status;
      }
      
      this.$emit('open-chat', receiverId, senderId, requestId, chatId, status);
    },

    async acceptSwapRequest() {
      const swapRequestId = this.request._id;
      const chosenSkill = this.selectedSkill;

      try {
        await this.$store.dispatch('swapRequests/acceptSwapRequest', {
          swapRequestId,
          chosenSkill,
        });
      } catch (error) {
        console.error('Error accepting swap request:', error);
      }
    },

    async rejectSwapRequest() {
      const swapRequestId = this.request._id;
      try {
        await this.$store.dispatch('swapRequests/rejectSwapRequest', swapRequestId);
      } catch (error) {
        console.error('Error rejecting swap request:', error);
      }
    },
  },

  watch: {
  'request._id': {
    immediate: true,
    deep: true,
    handler(newValue, oldValue) {
      if (oldValue && newValue !== oldValue) {
        this.selectedSkill = null;
      }
    },
  },
},
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
.actions {
  pointer-events: auto;
}

.skill_card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>