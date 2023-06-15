<template>
  <div class="banner-container" :class="draggingClass">
    <div class="save-cancel_buttons" v-if="showButtons">
        <v-btn class="save-cancel_buttons_btn" @click="saveBanner">Сохранить</v-btn>
        <v-btn class="save-cancel_buttons_btn" @click="cancelBanner">Отменить</v-btn>
    </div>
    <div 
      class="profile-banner" 
      :style="bannerStyle" 
      @mouseover="mouseOver" 
      @mouseleave="mouseLeave"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    >
      <div class="overlay" v-if="showOverlay">
        <banner-button 
          @menu-change="menuChange"
          @upload="clickInput"
        />
      </div>
    </div>

    <banner-dialog 
      v-model="dialog" 
      @save="updateBannerUrl"
    />

    <input type="file" ref="fileInput" accept="image/*"  style="display: none" @change="handleFileUpload" />
  </div>
</template>

<script>
import BannerDialog from './BannerDialog.vue';
import BannerButton from './BannerButton.vue';

export default {
  components: {
    BannerDialog,
    BannerButton
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dragging: false,
      startY: 0,
      bannerY: 0,
      selectedFile: null,
      bannerUrl: this.user.banner ? this.user.banner : '',
      showOverlay: false,
      menuVisible: false,
      dialog: false,
      showButtons: false,
      imageHeight: 0,
      containerHeight: 0,
    };
  },

  computed: {
    bannerStyle() {
      if (this.bannerUrl) {
        return {
          backgroundImage: `url(${this.bannerUrl})`,
          backgroundPosition: `center ${this.bannerY}px`,
          cursor: 'move'
        };
      }
      return {};
    },
    draggingClass() {
      return this.dragging ? 'no-select' : '';
    }
  },

  methods: {
    mouseDown(e) {
      this.dragging = true;
      this.startY = e.clientY;

      document.addEventListener('mousemove', this.mouseMove);
      document.addEventListener('mouseup', this.mouseUp);
    },

    mouseMove(e) {
      if (!this.dragging) return;
      const dy = e.clientY - this.startY;

      // Ограничиваем перемещение изображения
      const newBannerY = this.bannerY + dy;
      if (newBannerY <= 0 && Math.abs(newBannerY) <= this.imageHeight + this.containerHeight) {
        this.bannerY = newBannerY;
        this.startY = e.clientY;
      }
    },

    mouseUp() {
      this.dragging = false;

      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mouseup', this.mouseUp);
    },

    mouseOver() {
      this.showOverlay = true;
    },

    mouseLeave() {
      if (!this.menuVisible) {
        this.showOverlay = false;
      }
    },

    menuChange(value) {
      this.menuVisible = value;
      if (!value) {
        this.showOverlay = false;
      }
    },

    clickInput() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.onload = (e) => {
        const url =  e.target.result;
        this.bannerUrl = url;
        this.showButtons = true;

        // Обновляем высоту изображения
        const img = new Image();
        img.onload = () => {
          this.imageHeight = img.height;
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    },

    updateBannerUrl(url) {
      this.bannerUrl = url;
    },
  },

  mounted() {
    this.containerHeight = this.$el.clientHeight;
  },
};
</script>

<style scoped lang="scss">
.save-cancel_buttons {
  position: absolute;
  width: 100%;
  z-index: 999;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: flex-end;
  &_btn{ 
    margin-top: 0.5rem;
    margin-right: 1rem;
  }
}

.banner-container {
  height: 20rem;
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

.no-select {
  user-select: none;
}

.overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  padding: 10px;
}
</style>
