<template>
  <div class="avatar-container" @click="triggerAvatarUpdate">
    <v-avatar size="150">
      <img :src="avatarUrl" alt="User Avatar" />
    </v-avatar>
    <div class="overlay">
      <v-icon color="white">mdi-camera</v-icon>
    </div>
    <input type="file" ref="avatarInput" accept="image/*" @change="handleAvatarUpdate" style="display: none;">
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

  data() {
    return {
      avatarUrl: null
    }
  },

  computed: {
    computedAvatarUrl() {
      if (this.avatarUrl) return this.avatarUrl;
      if (!this.user || !this.user.avatar) return "https://via.placeholder.com/150"
      return this.user.avatar;
    },
  },

  methods: {
    triggerAvatarUpdate() {
      this.$refs.avatarInput.click();
    },

    handleAvatarUpdate(event) {
      const file = event.target.files[0];
      this.updateAvatar(file);
    },

    updateAvatar(file) {
      let reader = new FileReader();

      reader.onload = e => {
        this.avatarUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }
}
</script>

<style scoped>
.avatar-container {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.overlay {
  position: absolute;
  bottom: 15px;
  right: 0px;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .overlay {
  opacity: 1;
}

.overlay > v-icon {
  color: white;
}
</style>
