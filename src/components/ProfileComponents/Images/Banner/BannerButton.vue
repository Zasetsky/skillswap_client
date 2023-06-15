<template>
  <div>
    <v-menu v-model="menuVisible" offset-y @input="menuChange">
      <template v-slot:activator="{ on }">
        <div class="camera-icon" v-on="on">
          <v-icon large>
            mdi-camera
          </v-icon>
          <span>Change Banner</span>
        </div>
      </template>

      <v-list>
        <v-list-item @click="$emit('upload')">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Upload Cover Photo</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item @click="emitEvent('chooseCover')">
          <v-list-item-icon>
            <v-icon>mdi-folder-image</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Choose From Photos</v-list-item-title>
        </v-list-item>
        <v-list-item @click="emitEvent('repositionCover')">
          <v-list-item-icon>
            <v-icon>mdi-crop</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Reposition</v-list-item-title>
        </v-list-item>
        <v-list-item @click="emitEvent('removeCover')">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Remove</v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuVisible: false
    };
  },
  methods: {
    menuChange(value) {
      this.menuVisible = value;
      this.$emit('menu-change', value);
    },
  },
};
</script>

<style scoped>
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
