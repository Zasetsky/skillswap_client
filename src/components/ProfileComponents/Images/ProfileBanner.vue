<template>
  <div class="banner-container">
    <div 
      class="profile-banner" 
      :style="{ backgroundImage: `url(${bannerUrl})` }" 
      @mouseover="showOverlay = true" 
      @mouseleave="showOverlay = false"
    >
      <div class="overlay" v-if="showOverlay">
        <div class="camera-icon">
          <input type="file" accept="image/*" @change="previewImage" id="fileInput">
          <label for="fileInput">
            <v-icon large>
              mdi-camera
            </v-icon>
            <span>Change Banner</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedFile: null,
      bannerUrl: this.user.banner || '',
      previewImageSrc: '',
      showOverlay: false,
    };
  },
  methods: {
    previewImage(event) {
      if (event[0].size > 2000000) {
        this.selectedFile = null;
        this.$toast.error('File size should be less than 2 MB');
        return;
      }
      this.selectedFile = event[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageSrc = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    },
    async uploadBanner() {
      const formData = new FormData();
      formData.append('banner', this.selectedFile);

      try {
        const response = await this.$http.post('/api/uploadBanner', formData);
        this.bannerUrl = response.data.url;
      } catch (error) {
        console.error('Error uploading banner:', error);
      }
    },
  },
};
</script>

<style scoped>
.banner-container {
  height: 200px;
  background-color: #f9f9f9;
  position: relative;
}

.profile-banner {
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
}

.overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  padding: 10px;
}

.camera-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
}

.camera-icon input[type="file"] {
  display: none;
}

.camera-icon span {
  margin-left: 5px;
  font-size: 14px;
}
</style>