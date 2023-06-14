<template>
  <div>
    <h3>История запросов и сделок</h3>
    <strong-skills-card
      v-for="pastRequest in pastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
      :deal="findDeal(pastRequest)"
    />

    <v-card v-if="pastRequests.length === 0">
      <v-card-text>Здесь будет информация о прошлых запросах этого навыка</v-card-text>
    </v-card>
  </div>
</template>

<script>
import StrongSkillsCard from "./StrongSkillsCard.vue";

import { mapGetters } from "vuex";
import skillMixins from "@/mixins/skillMixins";

export default {
  mixins: [skillMixins],

  components: {
    StrongSkillsCard,
  },

  computed: {
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters('deal', ['getAllDeals']),

    pastRequests() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const currentUserId = this.currentUser._id;
      const localSkillId = this.$route.query.strongSkillId;

      return this.getSwapRequests.filter(request => {
        let userIsSender = request.senderId === currentUserId;
        let userIsReceiver = request.receiverId === currentUserId;
        
        let skillsToCheck;

        if (userIsSender) {
          skillsToCheck = request.senderData.skillsToTeach;
        } else if (userIsReceiver) {
          skillsToCheck = request.senderData.skillsToLearn;
        }

        return (
          skillsToCheck.some(skill => skill._id === localSkillId) &&
          (
            userIsReceiver && ["rejected", "cancelled", "completed"].includes(request.status) ||
            userIsSender && ["cancelled", "completed"].includes(request.status)
          )
        );
      });
    },
  },

  methods: {
    async findReviews(pastRequest) {
      // Если getAllReview еще не определен, верните пустой объект
      if (!this.getAllReviews) {
        return {};
      }

      // Отзыв, где пользователь является отправителем
      let senderReview = this.getAllReviews.find(review => 
        review.sender === this.currentUser._id && review.swapRequestId === pastRequest._id
      );

      // Отзыв, где пользователь является получателем
      let receiverReview = this.getAllReviews.find(review => 
        review.receiver === this.currentUser._id && review.swapRequestId === pastRequest._id
      );
      senderReview = senderReview.skillRating,
      receiverReview = receiverReview.skillRating
      console.log(senderReview);
      console.log(receiverReview);

      return {
        senderReview,
        receiverReview
      };
    },
  },
};
</script>