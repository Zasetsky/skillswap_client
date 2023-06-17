<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">Update Avatar</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="triggerFileInput">Upload New Photo</v-btn>
        <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;">
        <div class="image-grid">
          <div class="avatar-container" v-for="avatar in user.allAvatars" :key="avatar._id" @click="handleImageChosen(avatar)">
            <v-img class="avatar-img" :src="avatar"/>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      dialog: false,
    }
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.$emit('file-chosen', file);
      this.close();
    },
    handleImageChosen(avatar) {
      this.$emit('image-chosen', avatar);
      this.close();
    }
  }
}
</script>

<style scoped>
.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.avatar-container {
  width: 100px;
  height: 100px;
  margin: 10px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
</style>
