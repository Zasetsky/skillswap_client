<template>
  <div>
    <v-dialog v-model="localDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dense flat color="lighten-1">
          <v-toolbar-title>Update Avatar</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <vue-cropper
              v-if="imageSrc"
              ref="cropper"
              :src="imageSrc"
              :aspect-ratio="1"
              :guides="true"
              :view-mode="1"
              :background="true"
              :responsive="true"
              :check-orientation="true"
              :rotatable="false"
            ></vue-cropper>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="cropImage">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    imageSrc: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      localDialog: this.dialog,
    };
  },

  watch: {
    dialog(newVal) {
      this.localDialog = newVal;
    },
    localDialog(newVal) {
      if (newVal !== this.dialog) {
        this.$emit('update:dialog', newVal);
      }
    },
  },

  methods: {
    close() {
      this.$emit('update:dialog', false);
    },
    cropImage() {
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        this.$emit('crop-complete', blob);
      });
    },
  },
};
</script>

<style scoped>
.v-card__title {
  font-size: 1.25rem !important;
}
.v-card__text {
  height: 100%;
}
</style>
