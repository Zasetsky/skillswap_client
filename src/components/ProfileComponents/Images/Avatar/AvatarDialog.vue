<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">Update Avatar</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="triggerFileInput">Upload New Photo</v-btn>
        <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;">
        <!-- Here you can list existing photos for the user to choose from -->
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
    }
  }
}
</script>