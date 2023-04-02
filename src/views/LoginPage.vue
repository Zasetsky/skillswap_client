<template>
  <div>
    <SignUpForm v-if="isRegistered" @switch-to-signin="isRegistered = false" />
    <SignInForm v-else @switch-to-signup="isRegistered = true" />
  </div>
</template>

<script>
import SignUpForm from '@/components/LoginComponents/SignUpForm.vue';
import SignInForm from '@/components/LoginComponents/SignInForm.vue';

export default {
  name: 'LoginPage',
  components: {
    SignUpForm,
    SignInForm
  },
  data() {
    return {
      isRegistered: false,
    }
  }
};
</script>

<style scoped>
</style>