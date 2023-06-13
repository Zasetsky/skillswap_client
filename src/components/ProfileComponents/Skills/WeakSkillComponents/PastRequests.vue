<template>
  <div>
    <h3>История запросов и выполненных сделок</h3>
    <weak-skills-card
      v-for="pastRequest in filteredPastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
    >
    <template v-slot:review>
      <strong>Вам оставили рейтинг:{{ request.senderData.skillsToTeach[0].skill }}:</strong> {{ findReviews(pastRequest).receiverReview }}<br>
      
      <strong>Вы оставили рейтинг:{{ request.senderData.skillsToLearn[0].skill }}:</strong> {{ findReviews(pastRequest).senderReview }}<br>
    </template>
    </weak-skills-card>

    <v-card v-if="filteredPastRequests.length === 0">
      <v-card-text>Здесь будет информация об активной сделке</v-card-text>
    </v-card>
  </div>
</template>

<script>
import WeakSkillsCard from "./WeakSkillsCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    WeakSkillsCard,
  },

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("review", ["getAllReview"]),

    filteredPastRequests() {
      if (!this.getSwapRequests || this.getSwapRequests.length === 0) {
        return [];
      }

      const localSkillId = this.$route.query.weakSkillId;

      const filteredRequests = this.getSwapRequests.filter(request => {
        return (
          (request.receiverData.skillsToLearn.some((skill) => skill._id === localSkillId) ||
          request.receiverData.skillsToTeach.some((skill) => skill._id === localSkillId)) &&
          (request.status !== "pending" && request.status !== "accepted")
          );
        });
    
      return filteredRequests;
    },
  },

  async created() {
    await this.$store.dispatch("review/fetchAllUserReviews");
    console.log(this.getAllReview);
  },

  methods: {
    findReviews(pastRequest) {
      // Отзыв, где пользователь является отправителем
      
      const senderReview = this.getAllReview.find(review => 
        review.sender === this.currentUser._id && review.swapRequestId === pastRequest._id
      );

      // Отзыв, где пользователь является получателем
      const receiverReview = this.getAllReview.find(review => 
        review.receiver === this.currentUser._id && review.swapRequestId === pastRequest._id
      );

      return {
        senderReview,
        receiverReview,
      };
    },
  },
}
</script>
