<template>
  <div class="step2-basic-info">
    <h3>Основная информация</h3>
    <v-form ref="form">
      <v-text-field
        label="Имя"
        v-model.trim="$v.firstName.$model"
        :rules="firstNameRules"
        outlined
        required
      ></v-text-field>

      <v-text-field
        label="Фамилия"
        v-model.trim="$v.lastName.$model"
        :rules="lastNameRules"
        outlined
        required
      ></v-text-field>

      <v-textarea
        label="Краткая информация о себе"
        v-model.trim="$v.bio.$model"
        :rules="bioRules"
        outlined
        required
      ></v-textarea>

      <v-btn color="primary" @click="goToNextStep" :disabled="$v.$invalid">Далее</v-btn>
    </v-form>
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'Step2_BasicInfo',
  data() {
    return {
      firstName: '',
      lastName: '',
      bio: '',
    };
  },
  validations: {
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    bio: {
      maxLength: maxLength(200),
    },
  },
  computed: {
    firstNameRules() {
      return [
        (value) => !!value || 'Имя обязательно для заполнения',
        (value) =>
          (value && value.length <= 50) || 'Имя не может превышать 50 символов',
      ];
    },
    lastNameRules() {
      return [
        (value) => !!value || 'Фамилия обязательна для заполнения',
        (value) =>
          (value && value.length <= 50) || 'Фамилия не может превышать 50 символов',
      ];
    },
    bioRules() {
      if (this.$v.bio.$dirty && this.bio) {
        return [(value) => value.length > 0 && value.length <= 200 || 'Максимальная длина 200 символов'];
      }
      return [];
    },
  },
  methods: {
    async goToNextStep() {
      if (this.$v.$invalid) {
        this.$v.firstName.$touch();
        this.$v.lastName.$touch();
        this.$v.bio.$touch();
        return;
      }
      const userProfile = {
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
      };
      await this.$store.dispatch("user/updateProfile", userProfile);
      this.$emit('go-to-next-step');
    },
  },
};
</script>

<style scoped>
.step2-basic-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
