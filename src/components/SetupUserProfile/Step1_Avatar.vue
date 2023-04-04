<template>
  <div class="step1-avatar">
    <h3>Загрузите ваш аватар</h3>
    <v-avatar size="150">
      <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар" />
      <img v-else-if="currentUser && currentUser.avatar" :src="currentUser.avatar" alt="Аватар" />
    </v-avatar>
    <v-file-input
      label="Выберите файл"
      :show-size="1000"
      accept="image/*"
      v-model="avatarFile"
      @change="previewAvatar"
    ></v-file-input>
    <v-btn color="primary" @click="goToNextStep">Далее</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Step1_Avatar",
  data() {
    return {
      avatarFile: null,
      avatarUrl: null,
    };
  },
  methods: {
    ...mapActions("user", ["setAvatarUrl", "updateAvatar"]),

    previewAvatar() {
      if (this.avatarFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.avatarFile);
        reader.onload = async (event) => {
          this.avatarUrl = event.target.result;
        };
      }
    },
    async goToNextStep() {
      if (this.avatarFile) {
        await this.updateAvatar(this.avatarFile);
      }
      this.$emit("go-to-next-step");
    },
  },
  computed: {
    ...mapGetters("user", ["getAvatarUrl"]),
    ...mapGetters("auth", ["currentUser"])
  },
};
</script>

<style scoped>
.step1-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
