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
  methods: {
    ...mapActions('matching', ['fetchMatchingUsers']),
    async findMatchingUsers() {
      try {
        console.log(this.skillToLearn);
        const response = await this.fetchMatchingUsers(this.skillToLearn._id);
        this.matchingUsers = response.matchingUsers;
        console.log('foundUsers :', this.matchingUsers);
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
  computed: {
      ...mapGetters('auth', ['currentUser']),
      listSkillsToLearn() {
          if(!this.currentUser) return 'NaN';
          const SkillsToLearn = [];

          for (let i = 0; i < this.currentUser.skillsToLearn.length; i++) {
              const element = this.currentUser.skillsToLearn[i];
              SkillsToLearn.push(element);
          }
          return SkillsToLearn;
      }
  },
};
</script>
  