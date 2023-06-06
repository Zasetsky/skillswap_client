<template>
  <div class="step2-basic-info">
    <h3>Основная информация</h3>
    <v-form ref="form">
      <v-text-field
        label="Имя"
        v-model.trim="$v.firstname.$model"
        :rules="firstNameRules"
        outlined
        required
      ></v-text-field>

      <v-text-field
        label="Фамилия"
        v-model.trim="$v.lastname.$model"
        :rules="lastNameRules"
        outlined
        required
      ></v-text-field>

      <v-text-field
        label="Возраст"
        v-model.trim="$v.age.$model"
        :rules="ageRules"
        outlined
        required
        type="number"
      ></v-text-field>

      <v-select
        :items="['Мужской', 'Женский', 'Другой']"
        v-model.trim="$v.gender.$model"
        :rules="genderRules"
        label="Пол"
        required
        outlined
      ></v-select>

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
      firstname: '',
      lastname: '',
      age: '',
      gender: '',
      bio: '',
    };
  },
  validations: {
    firstname: {
      required,
    },
    lastname: {
      required,
    },
    age: { required },
    gender: { required },
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
    ageRules() {
      return [
        (value) => !!value || 'Возраст обязателен для заполнения',
        (value) =>
          (value && value >= 18 && value <= 100) || 'Возраст должен быть между 18 и 100',
      ];
    },
    genderRules() {
      return [(value) => !!value || 'Пол обязателен для заполнения'];
    },
    bioRules() {
      if (this.$v.bio.$dirty && this.bio) {
        return [(value) => value.length > 0 && value.length <= 200 || 'Максимальная длина 200 символов'];
      }
      return [];
    },
  },
  methods: {
    getValueFromText(text) {
      if (text === 'Мужской') {
        return 'male';
      } else if (text === 'Женский') {
        return 'female';
      } else {
        return 'other';
      }
    },

    async goToNextStep() {
      if (this.$v.$invalid) {
        this.$v.firstname.$touch();
        this.$v.lastname.$touch();
        this.$v.age.$touch();
        this.$v.gender.$touch();
        this.$v.bio.$touch();
        return;
      }
      const userProfile = {
        firstname: this.firstname,
        lastname: this.lastname,
        age: this.age,
        gender: this.getValueFromText(this.gender),
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
