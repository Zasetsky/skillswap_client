<template>
  <div class="home_container">
    <profile-banner :user="currentUser" />

    <v-row class="mt-5 ml-16">
      <v-col style="display: flex;">
        <profile-avatar 
          style="margin-top: 50px;"
          :user="currentUser"
        />

        <user-rating-card
          :user="currentUser"
        />
      </v-col>
      <v-col style="margin-top: 50px;">
        <h2>{{ name }}</h2>

        <skill-chips/>

        <h4>Биография:</h4>
        <p v-if="bio">{{ bio }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 style="margin-left: 60px;">Ваши сильные навыки:</h4>
        <user-statistics-diagram
          :user="currentUser"
        />
      </v-col>
      <v-col>
        <h4 class="ml-9">Отзывы о вас:</h4>
        <review-filter
          v-if="currentUser"
          :currentUserId="currentUser._id"
        />
        <review-list 
          :currentUserId="currentUser._id"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProfileBanner from "@/components/ProfileComponents/Images/Banner/ProfileBanner.vue";
import ProfileAvatar from "@/components/ProfileComponents/Images/ProfileAvatar.vue";
import SkillChips from "@/components/ProfileComponents/Skills/SkillsChip/SkillChipGroup.vue";
import UserStatisticsDiagram from "@/components/ProfileComponents/Rating/UserStatisticsDiagram.vue"
import UserRatingCard from "@/components/ProfileComponents/Rating/UserRatingCard.vue";
import ReviewFilter from "@/components/ProfileComponents/Reviews/ReviewFilter.vue";
import ReviewList from "@/components/ProfileComponents/Reviews/ReviewList.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    ProfileBanner,
    ProfileAvatar,
    SkillChips,
    UserStatisticsDiagram,
    UserRatingCard,
    ReviewFilter,
    ReviewList
},

  computed: {
    ...mapGetters("auth", ["currentUser"]),
    name() {
      if (!this.currentUser || !this.currentUser.firstname || !this.currentUser.lastname)
        return "NaN NaN";

      const firstname = this.currentUser.firstname;
      const lastname = this.currentUser.lastname;
      return `${firstname} ${lastname}`;
    },
  
    bio() {
      if (!this.currentUser || !this.currentUser.bio)
          return "";
      return this.currentUser.bio;
    }
  },
};
</script>

<style scoped>
.home_container {
    padding: 0;
    margin: 0;
}

</style>