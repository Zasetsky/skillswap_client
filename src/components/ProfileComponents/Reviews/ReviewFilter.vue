<template>
  <div>
    <div class="d-flex align-center my-3">
      <v-rating
        v-model="rating"
        color="gold"
        :half-increments="false"
        size="24"
        hover
        @click.native="handleRatingClick"
      ></v-rating>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  props: {
    currentUserId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      rating: 0,
      lastRating: null,
      clickCount: 0,
    };
  },

  methods: {
    ...mapActions("review", ["fetchUserReviews"]),
    ...mapMutations('review', ['SET_RATING_FILTER']),

    handleRatingClick() {
      this.clickCount++;
      if (this.clickCount === 2) {
        this.clickCount = 0;
        if (this.rating === this.lastRating) {
          this.rating = 0;
        }
      }
      this.lastRating = this.rating;
      this.SET_RATING_FILTER(this.rating);
    }
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
