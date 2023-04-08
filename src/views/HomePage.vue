<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="12" sm="4" md="3">
        <v-avatar size="150">
          <img :src="avatarUrl" alt="User Avatar" />
        </v-avatar>
      </v-col>
      <v-col cols="12" sm="8" md="9">
        <h2>{{ name }}</h2>
        <!-- <p>{{ user.title }}</p>
        <p>{{ user.location }}</p> -->
        <v-chip-group>
          <v-chip label color="primary" v-for="(skill, index) in strongSkills" :key="index">{{ skill }}</v-chip>
        </v-chip-group>
        <v-chip-group>
          <router-link
            v-for="(skill, index) in weakSkills"
            :key="index"
            :to="{ name: 'WeakSkillsPage', params: { skillObject: skill } }"
            v-slot="{ navigate, isActive }"
            custom
          >
            <v-chip
              label
              color="secondary"
              @click="navigate"
              :class="{ 'active-link': isActive }"
            >
              {{ skill.skill || skill.category || skill.subCategory }}
            </v-chip>
          </router-link>
        </v-chip-group>
        <p v-if="bio">{{ bio }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      user: {
        title: 'Web Developer',
        location: 'New York, USA',
        bio: 'I am a passionate web developer with experience in creating modern web applications using cutting-edge technologies. I am always eager to learn new skills and collaborate with like-minded professionals.',
      }
      };
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    name() {
      if (!this.currentUser || !this.currentUser.firstName || !this.currentUser.lastName) return "NaN NaN";
      const firstName = this.currentUser.firstName.toLowerCase();
      const lastName = this.currentUser.lastName.toLowerCase();
      const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
      return `${formattedFirstName} ${formattedLastName}`;
    },

    strongSkills() {
      if (!this.currentUser || !this.currentUser.skillsToTeach.length) return "NaN"
      const skills = [];
      for (let i = 0; i < this.currentUser.skillsToTeach.length; i++) {
        const element = this.currentUser.skillsToTeach[i];
        if(element.theme === "Языки") {
          skills.push(element.category);
        } else if(element.category === "Региональная кухня") {
          skills.push(element.subCategory);
        } else {
          skills.push(element.skill);
        }
      }
      return skills;
    },

    weakSkills() {
      if (!this.currentUser || !this.currentUser.skillsToLearn.length) return "NaN"
      return this.currentUser.skillsToLearn; // Возвращаем полный массив объектов, а не только имена навыков
    },

    avatarUrl() {
      if (!this.currentUser || !this.currentUser.avatar) return "https://via.placeholder.com/150"
      return this.currentUser.avatar
    },

    bio() {
      if (!this.currentUser || !this.currentUser.bio) return ""
      return this.currentUser.bio
    }

  },
  mounted() {
    console.log('USER: ', this.currentUser);
  }
};
</script>

<style scoped>
</style>