<template>
  <v-container>
    <v-row class="mt-5 ml-16">
      <v-col style="display: flex;">
        <profile-avatar 
          style="margin-top: 50px;"
          :user="currentUser"
        />
        <user-rating-card />
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
        <h4 style="margin-left: 50px;">Прогресс в сильных навыках:</h4>
        <user-statistics-diagram
          :user="currentUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileAvatar from "@/components/ProfileComponents/Avatar/ProfileAvatar.vue";
import SkillChips from "@/components/ProfileComponents/Skills/SkillsChip/SkillChipGroup.vue";
import UserStatisticsDiagram from "@/components/ProfileComponents/Rating/UserStatisticsDiagram.vue"
import UserRatingCard from "@/components/ProfileComponents/Rating/UserRatingCard.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    ProfileAvatar,
    SkillChips,
    UserStatisticsDiagram,
    UserRatingCard
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


/* .swap-request-counter {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  line-height: 18px;
  height: 18px;
  width: 18px;
  text-align: center;
} */
</style>