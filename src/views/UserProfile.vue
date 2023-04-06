<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-avatar size="120">
              <img v-if="userProfile.avatar" :src="userProfile.avatar">
              <img v-else src="https://via.placeholder.com/150">
            </v-avatar>
          </v-col>
          <v-col>
            <h2>{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
            <h4>Биография:</h4>
            <p>{{ userProfile.bio }}</p>
            <v-btn color="primary" @click="proposeSkillExchange">Предложить обмен навыками</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Прогресс в сильных навыках:</h4>
            <v-progress-linear 
                v-for="skill in userProfile.strongSkills" 
                :key="skill.name" 
                :value="skill.progress" 
                :buffer-value="100" 
                class="mb-4"
            >
              <strong>{{ skill.name }}:</strong> {{ skill.progress }}%
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>
  
  
<script>
import { mapState, mapActions } from 'vuex';

export default {
    props: {
        userId: {
        type: String,
        required: true,
        },
    },
    data() {
        return {
            localUserId: this.userId || '',
        };
    },
    computed: {
    ...mapState('user', ['userProfile']),
    },
    async created() {
        try {
            await this.fetchUserProfile(this.localUserId);
            console.log('userid: ', this.userId);
            console.log('localUserid: ', this.localUserId);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    },
    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        proposeSkillExchange() {
        // Здесь вам нужно добавить код для предложения обмена навыками с другим пользователем.
        // Например, отправьте запрос к API с предложением обмена навыками.
        console.log('Proposing skill exchange...');
        },
    },
};
</script>
  