<template>
  <div>
    <v-container>
      <v-row class="mt-5 ml-16">
        <v-col style="display: flex;">
          <profile-avatar
            style="margin-top: 50px;"
            :user="getUserProfile" 
          />
          <user-rating-card
            :user="getUserProfile" 
          />
        </v-col>
        <v-col style="margin-top: 50px;">
          <h2>{{ getUserProfile.firstname }} {{ getUserProfile.lastname }}</h2>
          <h4>Биография:</h4>
          <p>{{ getUserProfile.bio }}</p>

          <request-button
            :isSwapRequestAlreadySent="isSwapRequestAlreadySent" 
            :isSwapRequestReceived="isSwapRequestReceived"
            />
          <cancel-button
            :isSwapRequestAlreadySent="isSwapRequestAlreadySent"
            :isSwapRequestReceived="isSwapRequestReceived"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4 style="margin-left: 90px;">Сильные навыки:</h4>
          <user-statistics-diagram
            :user="getUserProfile"
          />
        </v-col>
        <v-col>
        <h4 class="ml-9">Отзывы о пользователе:</h4>
        <review-filter
          v-if="getUserProfile && getUserProfile._id"
          :currentUserId="getUserProfile._id"
        />
      </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import ProfileAvatar from '@/components/ProfileComponents/Avatar/ProfileAvatar.vue';
import RequestButton from '@/components/ProfileComponents/Buttons/RequestButton.vue';
import CancelButton from '@/components/ProfileComponents/Buttons/RequestCancelButton.vue';
import UserStatisticsDiagram from "@/components/ProfileComponents/Rating/UserStatisticsDiagram.vue"
import UserRatingCard from "@/components/ProfileComponents/Rating/UserRatingCard.vue";
import ReviewFilter from "@/components/ProfileComponents/Reviews/ReviewFilter.vue";

import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ProfileAvatar,
    UserStatisticsDiagram,
    RequestButton,
    CancelButton,
    UserRatingCard,
    ReviewFilter
  },

  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localUserId: this.userId || "",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserProfile"]),
    ...mapGetters("swapRequests", ["getSwapRequests"]),

    isSwapRequestAlreadySent() {
      if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
        return this.getSwapRequests.some((request) => request.receiverId === this.localUserId && (request.status === "pending" || request.status === "accepted"));
      }
      else {
        return false;
      }
    },

    isSwapRequestReceived() {
      if (this.getSwapRequests || this.getSwapRequests.length !== 0) {
        return this.getSwapRequests.some((request) => request.senderId === this.localUserId && (request.status === "pending" || request.status === "accepted"));
      }
      else {
        return false;
      }
    },
  },

  methods: {
    ...mapActions("user", ["fetchUserProfile"]),
    ...mapActions("swapRequests", ["fetchAllSwapRequests"]),
  },

  async mounted() {
    try {
      await this.fetchUserProfile(this.localUserId);
      console.log(this.getUserProfile);
      await this.fetchAllSwapRequests();
    }
    catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
};
</script>
