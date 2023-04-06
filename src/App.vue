<template>
  <v-app>
    <nav v-if="isAuthenticated && !isLoginPage">
      <NavbarComponent />
    </nav>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue';
// import { mapActions } from "vuex";

export default {
  name: 'App',
  components: {
    NavbarComponent,
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isLoginPage() {
      return this.$route.path === '/';
    },
  },
  methods: {
    // ...mapActions('user', ['getCurrentLocation']),
    // async getUserLocation() {
    //   try {
    //     const location = await this.getCurrentLocation();
    //     console.log('User location:', location);
    //   } catch (error) {
    //     console.error('Error getting user location:', error);
    //   }
    // },
  },
  // mounted() {
  //   this.getUserLocation();
  // }
};
</script>

<style lang="scss">
body {
  background-color: #8ab368;
}
</style>
