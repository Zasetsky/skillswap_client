<template>
  <v-container>
    <v-row class="mt-5 ml-16">
      <v-col style="display: flex;">
        <profile-avatar 
          :user="currentUser"
        />
      </v-col>
      <v-col>
        <h2>{{ name }}</h2>

        <skill-chips />

        <p v-if="bio">{{ bio }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <user-statistics-diagram
          :user="currentUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileAvatar from "@/components/ProfileComponents/Avatar/ProfileAvatar.vue";
import SkillChips from "@/components/ProfileComponents/Skills/SkillChips/SkillChipGroup.vue";
import UserStatisticsDiagram from "@/components/ProfileComponents/Rating/UserStatisticsDiagram.vue"

import { mapGetters } from "vuex";

export default {
  components: {
    ProfileAvatar,
    SkillChips,
    UserStatisticsDiagram
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
  // mounted() {
  //   console.log(this.currentUser);
  //   this.renderChart(this.chartData, this.options)
  // }
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