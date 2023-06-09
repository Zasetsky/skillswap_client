<template>
  <div class="rating_wrapper">
    <v-col>
      <v-col>
        <div class="caption">Total Skills</div>
        <div class="rating_row">
          <v-rating v-model="currentUser.totalSkillsRating" readonly half-increments color="gold"></v-rating>
          <pre>{{ currentUser.totalSkillsRating }}</pre>
        </div>
      </v-col>
      
      <v-col>
        <div class="caption">Loyalty</div>
        <div class="rating_row">
          <v-rating v-model="currentUser.loyaltyRating" readonly half-increments color="gold"></v-rating>
          <pre>{{ currentUser.loyaltyRating }}</pre>
        </div>
      </v-col>

      <v-col>
        <div class="caption">Reliability</div>
        <div class="rating_row">
          <v-rating v-model="currentUser.reliabilityRating" readonly half-increments color="gold"></v-rating>
          <pre>{{ currentUser.reliabilityRating }}</pre>
        </div>
      </v-col>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters("auth", ["currentUser"])
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
