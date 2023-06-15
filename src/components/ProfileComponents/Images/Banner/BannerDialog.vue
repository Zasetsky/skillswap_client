<template>
  <v-dialog v-model="dialogValue" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Change Banner</span>
      </v-card-title>

      <v-card-text>
        <v-file-input 
          accept="image/*" 
          hide-details
          show-size
          @change="previewImage"
        />
        
        <v-img 
          v-if="selectedFile" 
          :src="previewImageSrc" 
          max-height="200" 
          class="mt-3"
        ></v-img>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
        <v-btn color="blue darken-1" text @click="saveBanner">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedFile: null,
      previewImageSrc: '',
      dialogValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.dialogValue = newValue;
    },
    dialogValue(newValue) {
      if (!newValue) {
        this.$emit('input', newValue);
      }
    },
  },
  methods: {
    previewImage(event) {
      this.selectedFile = event[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageSrc = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    },
    async saveBanner() {
      const formData = new FormData();
      formData.append('banner', this.selectedFile);

      try {
        const response = await this.$http.post('/api/uploadBanner', formData);
        this.$emit('save', response.data.url);
        this.closeDialog();
      } catch (error) {
        console.error('Error uploading banner:', error);
      }
    },
    closeDialog() {
      this.$emit('input', false);
    },
  },
};
</script>
