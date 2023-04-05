<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="12" sm="4" md="3">
        <v-avatar size="150">
          <img src="https://via.placeholder.com/150" alt="User Avatar" />
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="8" md="9">
        <h2>{{ user.name }}</h2>
        <p>{{ user.title }}</p>
        <p>{{ user.location }}</p>
        <v-chip-group>
          <v-chip label color="primary" v-for="skill in user.strongSkills" :key="skill">{{ skill }}</v-chip>
        </v-chip-group>
        <v-chip-group>
          <v-chip label color="secondary" v-for="skill in user.weakSkills" :key="skill">{{ skill }}</v-chip>
        </v-chip-group>
        <p>{{ user.bio }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John Doe',
        title: 'Web Developer',
        location: 'New York, USA',
        strongSkills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
        weakSkills: ['Python', 'Django'],
        bio: 'I am a passionate web developer with experience in creating modern web applications using cutting-edge technologies. I am always eager to learn new skills and collaborate with like-minded professionals.',
      },
    };
  },
};
</script>

<style scoped>
</style>