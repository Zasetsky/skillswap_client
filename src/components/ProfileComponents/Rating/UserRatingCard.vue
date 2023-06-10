<template>
  <div class="rating_wrapper">
    <v-col>
      <v-col>
        <div class="caption">Total Skills</div>
        <div class="rating_row">
          <v-rating :value="roundedRating(user.totalSkillsRating)" readonly half-increments color="gold" size="16"></v-rating>
          <pre>{{ user.totalSkillsRating }}</pre>
        </div>
      </v-col>
      
      <v-col>
        <div class="caption">Loyalty</div>
        <div class="rating_row">
          <v-rating :value="roundedRating(user.loyaltyRating)" readonly half-increments color="gold" size="16"></v-rating>
          <pre>{{ user.loyaltyRating }}</pre>
        </div>
      </v-col>

      <v-col>
        <div class="caption">Reliability</div>
        <div class="rating_row">
          <v-rating :value="roundedRating(user.reliabilityRating)" readonly half-increments color="gold" size="16"></v-rating>
          <pre>{{ user.reliabilityRating }}</pre>
        </div>
      </v-col>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    roundedRating(rating) {
      const decimalPart = rating % 1;
      const integerPart = Math.floor(rating);
      if (decimalPart < 0.5) {
        return integerPart;
      } else if (decimalPart >= 0.5) {
        return integerPart + 0.5;
      }
    }
  }
}
</script>

<style scoped>
.rating_row {
  display: flex;
  align-items: center;
  gap: 1em;
}
.rating_wrapper {
  margin-left: 1rem;
}
</style>
