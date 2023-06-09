<template>
  <div>
    <v-card v-for="(review, index) in getUserReviews(currentUserId)" :key="index" class="my-3">
      <v-card-title>{{ review.sender.firstname + ' ' + review.sender.lastname }}</v-card-title>
      <v-card-subtitle>
        <div class="d-flex justify-space-between align-center">
          <v-rating :value="review.skillRating" readonly half-increments color="gold"></v-rating>
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
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    currentUserId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters("review", ["getUserReviews"]),
  },

  methods: {
    ...mapActions("review", ["fetchUserReviews"]),
  },

  watch: {
    async currentUserId(newId, oldId) {
      if(newId !== oldId) {
        try {
          await this.fetchUserReviews(newId);
        } catch (error) {
          console.log(error);
        }
      }
    }
  },

  async mounted() {
    try {
      await this.fetchUserReviews(this.currentUserId);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style scoped>
</style>