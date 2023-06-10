<template>
  <div>
    <v-card v-for="(review, index) in getFilteredReviews(currentUserId)" :key="index" class="my-3">
      <v-card-title>{{ review.sender.firstname + ' ' + review.sender.lastname }}</v-card-title>
      <v-card-subtitle>
        <div class="d-flex justify-space-between align-center">
          <div style="flex-direction: column;">
            <h4>{{ review.skill.skill }}</h4>
            <v-rating :value="review.skillRating" readonly half-increments color="gold"></v-rating>
          </div>
          
          <span class="ml-3" v-if="review.isLate">Late</span>
        </div>
      </v-card-subtitle>
      <v-card-text>{{ review.comment }}</v-card-text>
      <v-card-actions>
        <v-chip x-small color="grey lighten-2">{{ new Date(review.createdAt).toLocaleDateString() }}</v-chip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    currentUserId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters("review", ["getFilteredReviews"]),
  }
}
</script>

<style scoped>
</style>
