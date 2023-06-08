<template>
  <div>
    <v-container>
      <v-row class="mt-5 ml-16">
        <v-col>
          <profile-avatar :user="getUserProfile" />
        </v-col>
        <v-col>
          <h2>{{ getUserProfile.firstname }} {{ getUserProfile.lastname }}</h2>
          <h4>Биография:</h4>
          <p>{{ getUserProfile.bio }}</p>

          <request-button />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4 style="margin-left: 50px;">Прогресс в сильных навыках:</h4>
          <user-statistics-diagram
            :user="getUserProfile"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import ProfileAvatar from '@/components/ProfileComponents/Avatar/ProfileAvatar.vue';
import RequestButton from '@/components/ProfileComponents/Buttons/RequestButton.vue';
import UserStatisticsDiagram from "@/components/ProfileComponents/Rating/UserStatisticsDiagram.vue"

import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ProfileAvatar,
    UserStatisticsDiagram,
    RequestButton
  },

  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localUserId: this.userId || "",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserProfile"]),
  },

  methods: {
    ...mapActions("user", ["fetchUserProfile"]),
    ...mapActions("swapRequests", ["fetchAllSwapRequests"]),
  },

  async mounted() {
    try {
      await this.fetchUserProfile(this.localUserId);
      console.log(this.getUserProfile);
      await this.fetchAllSwapRequests();
    }
    catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
};
</script>
