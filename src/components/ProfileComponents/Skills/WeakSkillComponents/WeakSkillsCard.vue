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

      <template v-if="request.senderData && request.status !== 'rejected'">
        <strong>Навык, который вы преподаёте:</strong> 
        {{ request.status === 'pending' ? '???' : (skillToTeach) }}<br>
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

      <template>
        <div v-if="findReviewsForPastRequest(request, getAllReviews, currentUser).receiverReview" class="review_container">
          <strong>Вам оставили рейтинг:</strong>
          <span>{{ teachingSkill }}</span>
          <v-rating
            class="review_container_rating"
            color="gold"
            dense
            readonly
            small
            :value="findReviewsForPastRequest(request, getAllReviews, currentUser).receiverReview"
          >
          </v-rating>
          <br>
        </div>
        
        <div v-if="findReviewsForPastRequest(request, getAllReviews, currentUser).senderReview" class="review_container">
          <strong>Вы оставили рейтинг:</strong> 
          <span>{{ learningSkill }}</span>
          <v-rating
            class="review_container_rating"
            color="gold"
            dense
            readonly
            small
            :value="findReviewsForPastRequest(request, getAllReviews, currentUser).senderReview"
          >
          </v-rating>
          <br>
        </div>
      </template>
      
      <template v-if="request.dealId">
        <strong>Статус сделки:</strong> {{ deal.status }}<br>
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
import skillMixins from "@/mixins/skillMixins";

export default {
  mixins: [chatMixin, skillMixins],

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
    ...mapGetters("review", ["getAllReviews"]),

    skillToTeach() {
      if (this.currentUser._id === this.request.senderId) {
        return this.request.senderData.skillsToTeach[0]?.skill ?? '';
      } else {
        return this.request.receiverData.skillsToLearn[0]?.skill ?? '';
      }
    },

    teachingSkill() {
      if (this.currentUser._id === this.request.senderId) {
        return this.request.senderData.skillsToTeach[0]?.skill ?? '';
      } else {
        return this.request.senderData.skillsToLearn[0]?.skill ?? '';
      }
    },

    learningSkill() {
      if (this.currentUser._id === this.request.senderId) {
        return this.request.senderData.skillsToLearn[0]?.skill ?? '';
      } else {
        return this.request.senderData.skillsToTeach[0]?.skill ?? '';
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
<style scoped lang="scss">
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

.completed {
  text-decoration: line-through;
}

.review_container {
  display: flex;

  span{
    margin-left: 0.2rem;
  }

  &_rating {
    margin-left: 0.2rem;
  }
}
</style>