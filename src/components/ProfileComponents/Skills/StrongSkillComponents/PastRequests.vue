<template>
  <div>
    <h3>История запросов и сделок</h3>
    <strong-skills-card
      class="skill-card"
      v-for="pastRequest in pastRequests"
      :key="pastRequest._id"
      :request="pastRequest"
      :deal="findDeal(pastRequest)"
    >
      <template v-slot:review>
        <strong>Вам оставили рейтинг:</strong> {{ pastRequest.senderData.skillsToTeach[0].skill }} {{ findReviews(pastRequest).receiverReview }}<br>
        
        <strong>Вы оставили рейтинг:</strong> {{ pastRequest.senderData.skillsToLearn[0].skill }} {{ findReviews(pastRequest).senderReview }}<br>
      </template>
    </strong-skills-card>

    <v-card v-if="pastRequests.length === 0">
      <v-card-text>Здесь будет информация о прошлых запросах этого навыка</v-card-text>
    </v-card>
  </div>
</template>

<script>
import StrongSkillsCard from "./StrongSkillsCard.vue";

import { mapGetters } from "vuex";
import skillMixins from "@/mixins/skillMixins";
import { getSocket } from "@/soket";

export default {
  mixins: [skillMixins],

  components: {
    StrongSkillsCard,
  },

  computed: {
    ...mapGetters("swapRequests", ["getSwapRequests"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters('deal', ['getAllDeals']),
    ...mapGetters('review', ['getAllReviews']),

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
  
  async created() {
    await this.$store.dispatch("deal/fetchAllDeals");
    await this.$store.dispatch("review/fetchAllUserReviews");
  },

  methods: {
    async findReviews(pastRequest) {
      // Если getAllReview еще не определен, верните пустой объект
      if (!this.getAllReviews) {
        return {};
      }

      // Отзыв, где пользователь является отправителем
      const senderReview = this.getAllReviews.find(review => 
        review.sender === this.currentUser._id && review.swapRequestId === pastRequest._id
      );

      // Отзыв, где пользователь является получателем
      const receiverReview = this.getAllReviews.find(review => 
        review.receiver === this.currentUser._id && review.swapRequestId === pastRequest._id
      );

      console.log('Sender review: ', senderReview);
      console.log('Receiver review: ', receiverReview);

      return {
        senderReview: senderReview ? senderReview.skillRating : 'Отзыв отсутствует',
        receiverReview: receiverReview ? receiverReview.skillRating : 'Отзыв отсутствует',
      };
    },
  },


  beforeDestroy() {
    const socket = getSocket();

    socket.off("allDeals");
    socket.off("error");
  },
};
</script>
