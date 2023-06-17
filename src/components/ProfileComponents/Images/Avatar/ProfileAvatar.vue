<template>
  <div class="avatar-container">
    <v-avatar class="user_avatar" size="150" @click="openFullImage">
      <img :src="computedAvatarUrl" alt="User Avatar" />
    </v-avatar>
    <div class="overlay" @click="openDialog">
      <v-icon color="white">mdi-camera</v-icon>
    </div>
    <avatar-dialog ref="avatarDialog" :user="user" @file-chosen="handleFileChosen" @image-chosen="handleImageChosen"></avatar-dialog>
    <full-image-dialog ref="fullImageDialog" :allAvatars="user.allAvatars" :currentAvatar="computedAvatarUrl"></full-image-dialog>
    <avatar-crop-dialog ref="avatarCropDialog" :dialog="cropDialog" :image-src="imageSrc" @crop-complete="updateAvatar" @update:dialog="cropDialog = $event"></avatar-crop-dialog>
  </div>
</template>

<script>
import AvatarDialog from './AvatarDialog.vue';
import FullImageDialog from './FullImageDialog.vue';
import AvatarCropDialog from './AvatarCropDialog.vue';

export default {
  components: {
    AvatarDialog,
    FullImageDialog,
    AvatarCropDialog
  },
  props: {
    user: {
      type: Object,
      default: null  
    }
  },
  data() {
    return {
      originalFile: null,
      croppedFile: null,
      cropDialog: false,
      imageSrc: null,
    }
  },
  computed: {
    computedAvatarUrl() {
      if (this.croppedFile) return URL.createObjectURL(this.croppedFile);
      if (!this.user || !this.user.avatar) return "https://via.placeholder.com/150"
      return this.user.avatar;
    },
  },
  methods: {
    openDialog() {
      this.$refs.avatarDialog.open();
    },

    openFullImage() {
      this.$refs.fullImageDialog.open();
    },

    handleImageChosen(avatarUrl) {
      this.imageSrc = avatarUrl;
      this.cropDialog = true;
    },

    handleFileChosen(file) {
      let reader = new FileReader();

      reader.onload = e => {
        this.imageSrc = e.target.result;
        this.cropDialog = true;
      };

      reader.readAsDataURL(file);
      this.originalFile = file;
    },
    async updateAvatar(blob) {
      this.croppedFile = new File([blob], "cropped.jpeg", { type: "image/jpeg" });

      await this.$store.dispatch('user/updateAvatars', {
        original: this.originalFile,
        cropped: this.croppedFile
      });

      this.imageSrc = null;
      this.cropDialog = false;
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

.user_avatar {
  cursor: pointer;
}

.overlay {
  position: absolute;
  bottom: 15px;
  right: 5px;
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
