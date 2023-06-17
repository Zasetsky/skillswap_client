<template>
  <v-dialog class="view_avatar" v-model="dialog" max-width="45rem">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Avatar View</v-toolbar-title>
      </v-toolbar>
      <div class="avatar-container">
        <v-img :src="currentAvatarSrc" contain></v-img>
        <div class="controls" v-if="allAvatars.length > 1">
          <v-btn icon dark class="control-button prev-button" @click="previousAvatar">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon dark class="control-button next-button" @click="nextAvatar">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    allAvatars: {
      type: Array,
      default: () => []
    },

    currentAvatar: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      dialog: false,
      currentAvatarIndex: 0,
    }
  },

  computed: {
    currentAvatarSrc() {
      return this.allAvatars[this.currentAvatarIndex] || null;
    },
  },

  mounted() {
    const avatarBaseName = this.currentAvatar.split('-cropped.jpeg')[0];
    const originalAvatarIndex = this.allAvatars.findIndex(avatar => avatar.startsWith(avatarBaseName));

    if (originalAvatarIndex >= 0) {
      this.currentAvatarIndex = originalAvatarIndex;
    }
  },

  methods: {
    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    previousAvatar() {
      if (this.currentAvatarIndex > 0) {
        this.currentAvatarIndex--;
      } else {
        this.currentAvatarIndex = this.allAvatars.length - 1;
      }
    },

    nextAvatar() {
      if (this.currentAvatarIndex < this.allAvatars.length - 1) {
        this.currentAvatarIndex++;
      } else {
        this.currentAvatarIndex = 0;
      }
    },
  }
}
</script>

<style scoped>
.view_avatar {
  background: black; /* Цвет фона окна */
}
.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}
.control-button {
  background: rgba(0, 0, 0, 0.5);
}
.prev-button {
  left: 0;
}
.next-button {
  right: 0;
}
</style>
