<template>
  <v-card
    :key="request._id"
    class="mb-4"
    :class="request.status === 'pending' || request.status === 'rejected' ? 'skill_card_pending' : 'skill_card'"
    @click="handleClick"
  >
    <v-card-text>
      <v-avatar size="64" class="mb-2">
        <img :src="getAvatarUrl" alt="User avatar">
      </v-avatar>

      <strong>Имя:</strong> {{ getName }}<br>

      <slot name="rating"></slot>

      <template v-if="request.status !== 'pending'">
        <strong>{{ skillsLabel }}</strong>
        <span v-for="(skillToTeach, index) in skillsToDisplay" :key="index">
          {{ skillToTeach.skill }}
          <span v-if="index < request.senderData.skillsToTeach.length - 1">, </span>
        </span><br>
      </template>

      <template v-if="isDealStatusAllowed">
        <strong>Длительность занятия:</strong> {{ deal.form.meetingDuration }} мин<br>
      </template>

      <template v-if="isDealStatusAllowed">
        <span :class="{'completed': deal.form.isCompleted}">
          <strong>Встреча по навыку {{ request.senderData.skillsToLearn[0].skill }}:</strong> {{ deal.form.meetingDate }} в {{ deal.form.meetingTime }}<br>
        </span>

        <span :class="{'completed': deal.form2.isCompleted}">
          <strong>Встреча по навыку {{ request.senderData.skillsToTeach[0].skill }}:</strong> {{ deal.form2.meetingDate }} в {{ deal.form2.meetingTime }}<br>
        </span>
      </template>

      <slot name="review"></slot>

      <template v-if="request.dealId">
        <strong>Статус сделки:</strong> {{ deal.status }}<br>
      </template>

      <template v-if="isPast">
        <strong>Статус запроса:</strong> {{ request.status }}
      </template>
      <slot name="actions"></slot>
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
    deal: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),

    skillsToDisplay() {
      // Если текущий пользователь - отправитель
      if (this.currentUser._id === this.request.senderId) {
        return this.request.senderData.skillsToLearn;
      } 
      // Иначе, текущий пользователь - получатель
      else {
        return this.request.senderData.skillsToTeach;
      }
    },

    isDealStatusAllowed() {
      if (!this.deal) {
        return false;
      }
      return [
        "confirmed",
        "reschedule_offer",
        "reschedule_offer_update",
        "confirmed_reschedule",
        "half_completed",
        "half_completed_confirmed_reschedule",
        "completed"
      ].includes(this.deal.status);
    },

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

    skillsLabel() {
      if (this.request.senderData.skillsToTeach.length > 1) {
        return "Навыки, от которых вы отказались:";
      } else if (this.request.status === "rejected" && this.request.senderData.skillsToTeach.length < 2) {
        return "Навык, от которого вы отказались:";
      } else if (this.request.status === "cancelled") {
        return "Навык, где случилась отмена:";
      } else if (this.request.status === "completed") {
        return "Навык который вам преподавали:";
      } else {
        return "Навык который вам преподают:";
      }
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

      this.openOrCreateChat(receiverId, senderId, requestId, chatId, status);
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

.skill_card:hover {
  /* transform: scale(1.005); */
  background-color: rgba(0, 0, 0, 0.05);;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.skill_card_pending {
  pointer-events: none;
}

.completed {
  text-decoration: line-through;
}
</style>