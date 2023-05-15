<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2>Найдите подходящих пользователей для обмена навыками</h2>
          <v-autocomplete
            v-model="skillToLearn"
            :items="listSkillsToLearn"
            :item-text="item => item.skill"
            label="Выберите навык, который хотите улучшить"
            outlined
            return-object
          ></v-autocomplete>
          <v-btn color="primary" @click="findMatchingUsers">Найти</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list>
            <v-list-item v-for="user in matchingUsers" :key="user._id" @click="openUserProfile(user._id)">
              <v-list-item-content>
                <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
      return {
          skillToLearn: {},
          matchingUsers: [],
      };
  },

  computed: {
      ...mapGetters('auth', ['currentUser']),
      ...mapGetters('swapRequests', ['getSwapRequests']),

      listSkillsToLearn() {
        const swapRequests = this.getSwapRequests;
        if (!swapRequests) return [];

        // Get skillsToLearn from all swapRequests
        const swapRequestsSkillsToLearn = swapRequests.reduce((acc, request) => {
          acc.push(...request.receiverData.skillsToLearn);
          return acc;
        }, []);

        return this.currentUser.skillsToLearn.filter(skillToLearn => {
          return !swapRequestsSkillsToLearn.some(skillInRequest =>
            JSON.stringify(skillToLearn) === JSON.stringify(skillInRequest)
          );
        });
      },

  },

  created() {
    if (this.$route.query.skillToLearnId) {
      const skillToLearnId = this.$route.query.skillToLearnId;
      const skillToLearn = this.currentUser.skillsToLearn.find(
        (skill) => skill._id === skillToLearnId
      );
      if (skillToLearn) {
        this.skillToLearn = skillToLearn;
        this.findMatchingUsers();
      }
    }
  },

  methods: {
    ...mapActions('matching', ['fetchMatchingUsers']),
    async findMatchingUsers() {
      this.matchingUsers = [];
      try {
        const response = await this.fetchMatchingUsers(this.skillToLearn._id);
        this.matchingUsers = response.matchingUsers;
        
      } catch (error) {
        console.error(error);
      }
    },
    openUserProfile(userId) {
      this.$router.push({ 
        name: 'UserProfile', 
        params: { userId }, 
        query: { skillToLearnId: this.skillToLearn._id } 
      });
    }
  },
};
</script>
  