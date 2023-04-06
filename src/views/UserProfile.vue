<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-avatar size="120">
              <img :src="user.avatarUrl" :alt="`${user.firstName} ${user.lastName}`">
            </v-avatar>
          </v-col>
          <v-col>
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <h4>Биография:</h4>
            <p>{{ user.bio }}</p>
            <v-btn color="primary" @click="proposeSkillExchange">Предложить обмен навыками</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Прогресс в сильных навыках:</h4>
            <v-progress-linear v-for="skill in user.strongSkills" :key="skill.name" :value="skill.progress" :buffer-value="100" class="mb-4">
              <strong>{{ skill.name }}:</strong> {{ skill.progress }}%
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script>
export default {
    props: {
        userId: {
        type: String,
        required: true,
        },
    },
    data() {
        return {
        user: {
            avatarUrl: '',
            firstName: '',
            lastName: '',
            bio: '',
            strongSkills: [],
        },
        };
    },
    async created() {
        try {
        // Здесь вам нужно добавить код для получения информации о пользователе по userId.
        // Например, используйте запрос к API для получения информации о пользователе и обновите объект user.
        // const response = await fetchUserInfo(this.userId);
        // this.user = response.data;
        } catch (error) {
        console.error('Error fetching user info:', error);
        }
    },
    methods: {
        proposeSkillExchange() {
        // Здесь вам нужно добавить код для предложения обмена навыками с другим пользователем.
        // Например, отправьте запрос к API с предложением обмена навыками.
        console.log('Proposing skill exchange...');
        },
    },
};
</script>
  