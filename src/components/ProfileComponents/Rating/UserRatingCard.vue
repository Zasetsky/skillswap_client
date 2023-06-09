<template>
  <div class="rating_wrapper">
    <v-col>
      <v-col>
        <div class="caption">Total Skills</div>
        <div class="rating_row">
          <v-rating :value="user.totalSkillsRating" readonly half-increments color="gold"></v-rating>
          <pre>{{ user.totalSkillsRating }}</pre>
        </div>
      </v-col>
      
      <v-col>
        <div class="caption">Loyalty</div>
        <div class="rating_row">
          <v-rating :value="user.loyaltyRating" readonly half-increments color="gold"></v-rating>
          <pre>{{ user.loyaltyRating }}</pre>
        </div>
      </v-col>

      <v-col>
        <div class="caption">Reliability</div>
        <div class="rating_row">
          <v-rating :value="user.reliabilityRating" readonly half-increments color="gold"></v-rating>
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
      default: null
    }
  },
}
</script>

<style scoped>
.rating_row {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
