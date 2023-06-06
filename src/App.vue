<template>
  <v-app>
    <nav v-if="isPreSetup && !isLoginPage">
      <NavbarComponent />
    </nav>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue';
import { mapGetters } from "vuex";

export default {
  name: 'App',
  components: {
    NavbarComponent,
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),

    isPreSetup() {
      if (!this.currentUser) {
        return false;
      }

      return this.currentUser.isPreSetup;
    },

    isLoginPage() {
      return this.$route.path === '/';
    },
  },
  mounted() {
    this.$store.dispatch("user/fetchCurrentUser");
  }
};
</script>

<style lang="scss">
</style>
