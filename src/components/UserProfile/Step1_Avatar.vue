<template>
  <div class="step1-avatar">
    <h3>Загрузите ваш аватар</h3>
    <v-avatar size="150">
      <img :src="avatarUrl" alt="Аватар" />
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
export default {
  name: "Step1_Avatar",
  data() {
    return {
      avatarFile: null,
      avatarUrl: null,
    };
  },
  methods: {
    previewAvatar() {
      if (this.avatarFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.avatarFile);
        reader.onload = (event) => {
          this.avatarUrl = event.target.result;
          this.$emit("avatarSelected", this.avatarFile);
        };
      }
    },
    goToNextStep() {
      this.$emit("go-to-next-step");
    }
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
