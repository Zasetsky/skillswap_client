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
};
</script>

<style lang="scss">
body {
  background-color: #8ab368;
}
</style>
