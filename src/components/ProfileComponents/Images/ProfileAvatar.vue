<template >
  <div>
    <v-avatar size="150">
      <img :src="avatarUrl" alt="User Avatar" />
    </v-avatar>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: null  
    }
  },

  computed: {
    avatarUrl() {
      if (!this.user || !this.user.avatar) return "https://via.placeholder.com/150"
      return this.user.avatar
    },
  }
}
</script>
<style lang="">
    
</style>