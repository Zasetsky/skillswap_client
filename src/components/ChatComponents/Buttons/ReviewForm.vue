<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >
          Оставить отзыв
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="text-h5">Оставить отзыв</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-rating
                  v-model="rating"
                  color="orange"
                  background-color="orange lighten-3"
                  size="30"
                  dense
                ></v-rating>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-radio-group v-model="isLate">
                  <v-radio label="Был во-время" :value="false"></v-radio>
                  <v-radio label="Опоздал" :value="true"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-textarea
                  v-model="comment"
                  label="Комментарий (не обязательно)"
                  outlined
                  rows="4"
                  row-height="30"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="submitReview"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
      rating: 0,
      isLate: false,
      comment: "",
    };
  },

  computed: {
    ...mapGetters('deal', ['getCurrentDeal']),
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('swapRequests', ['getCurrentSwapRequest']),
    ...mapGetters('review', ['getCurrentDealReviews']),

    receiver() {
      const deal = this.getCurrentDeal;
      const currentUserId = this.currentUser._id;

      if (!deal || !deal.participants) {
        return null;
      }

      const receiverId = deal.participants.find((participantId) => participantId.toString() !== currentUserId);

      return receiverId || null;
    },

    formType() {
      const swapRequest = this.getCurrentSwapRequest;
      const currentUserId = this.currentUser._id;

      if (!swapRequest) {
        return null;
      }

      return swapRequest.senderId === currentUserId ? 'form' : 'form2';
    },

    skill() {
      const swapRequest = this.getCurrentSwapRequest;
      const currentUserId = this.currentUser._id;
      const senderData = this.getCurrentSwapRequest.senderData;

      if (!swapRequest || !senderData) {
        return null;
      }

      return currentUserId === swapRequest.senderId
        ? senderData.skillsToLearn[0]
        : senderData.skillsToTeach[0];
    },
  },

  methods: {
    async submitReview() {
      const review = {
        sender: this.currentUser._id,
        receiver: this.receiver,
        formType: this.formType,
        swapRequestId: this.getCurrentDeal.swapRequestId,
        dealId: this.getCurrentDeal._id,
        skill: this.skill,
        skillRating: this.rating,
        isLate: this.isLate,
        comment: this.comment,
      };

      try {
        await this.$store.dispatch("review/createReview", review);

        this.$emit("review-submitted");
        this.dialog = false;
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    },
  },
};
</script>
