<template>
  <div>
    <div class="d-flex align-center my-3">
      <v-rating
        v-model="ratingFilter"
        color="gold"
        :half-increments="false"
        size="24"
        @click.native="handleRatingClick"
      ></v-rating>
    </div>

    <ReviewList :reviews="filteredReviews" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ReviewList from './ReviewList.vue';

export default {
  components: {
    ReviewList
  },

  props: {
    currentUserId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      ratingFilter: 0,
      lastRating: null,
      clickCount: 0,
    };
  },

  computed: {
    ...mapGetters("review", ["getUserReviews"]),

    filteredReviews() {
      let reviews = [];
      
      if (this.ratingFilter > 0) {
        reviews = this.getUserReviews(this.currentUserId).filter(
          review => review.skillRating === this.ratingFilter
        );
      } else {
        reviews = this.getUserReviews(this.currentUserId);
      }
      
      return reviews.reverse();
    },
  },

  methods: {
    ...mapActions("review", ["fetchUserReviews", "listenCreateReview"]),

    handleRatingClick() {
      this.clickCount++;
      if (this.clickCount === 2) {
        this.clickCount = 0;
        if (this.ratingFilter === this.lastRating) {
          this.ratingFilter = 0;
        }
      }
      this.lastRating = this.ratingFilter;
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

      await this.listenCreateReview();
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style scoped>
</style>
