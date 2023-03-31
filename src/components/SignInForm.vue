<template>
  <div class="sign-in-form">
    <v-img src="../assets/images/swp_logo.png" class="sign-in-form__logo" />
    <v-form @submit.prevent="login" ref="form">
      <v-text-field
        label="Phone number, username, or email"
        outlined
        v-model="username"
        :class="{ notEmptyUsername: isNotEmptyUsername }"
        class="sign-in-form__input custom-outline"
        placeholder="'Phone number, username, or email'"
        @blur="$v.username.$touch()"
        persistent-hint
        :error-messages="usernameErrors"
      />
      <v-text-field
        label="Password"
        outlined
        v-model="password"
        :class="{ notEmptyPassword: isNotEmptyPassword }"
        class="sign-in-form__input password-custom-outline"
        :placeholder="'Password'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @blur="$v.password.$touch()"
        :error-messages="passwordErrors"
      />

      <v-checkbox
        v-model="remember"
        label="Remember me"
        class="sign-in-form__checkbox"
      />

      <v-btn
        :color="getButtonColor()"
        class="sign-in-form__button"
        block
        :disabled="!isFormValid"
        @click="login"
      >
        Log In
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'SignInForm',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      remember: false,
    };
  },
  validations: {
    username: { required, minLength: minLength(3), matches: value => /^[a-zA-Z][a-zA-Z0-9]*$/.test(value) },
    password: { required, minLength: minLength(6), matches: value => /^[a-zA-Z0-9!@#$%^&*()_+-=.,<>?/;:'"[\]{}|`~]+$/.test(value), },
  },
  computed: {
    isNotEmptyUsername() {
      if(this.username) {
        return true
      } else {
        return false
      }
    },
    isNotEmptyPassword() {
      if(this.password) {
        return true
      } else {
        return false
      }
    },
    isFormValid() {
      return !this.$v.username.$invalid && !this.$v.password.$invalid;
    },
    usernameErrors() {
      const errors = [];
      if (this.$v.username.$error) {
        if (!this.$v.username.required) {
          errors.push('Имя пользователя обязательно');
        }
        if (!this.$v.username.minLength) {
          errors.push('Имя пользователя должно содержать не менее 3 символов');
        }
        if (!this.$v.username.matches) {
          errors.push('Имя пользователя не может содержать символы и начинаться с цифр');
        }
      }
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (this.$v.password.$error) {
        if (!this.$v.password.required) {
          errors.push('Пароль обязателен');
        }
        if (!this.$v.password.minLength) {
          errors.push('Пароль должен содержать не менее 6 символов');
        }
        if (!this.$v.password.matches) {
          errors.push('Пароль не может содержать специальные символы');
        }
      }
      return errors;
    },
  },
  methods: {
    getButtonColor() {
      return this.isFormValid ? '#f8a201' : 'grey darken-1';
    },
    login() {
      this.$v.$touch();

      if (this.isFormValid) {
        // Очистка полей
        this.username = '';
        this.password = '';
        this.remember = false;
        this.$v.$reset();

        // Обработка входа
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-in-form {
  background-color: #fdfdfd;
  border-radius: 5px;
  max-width: 350px;
  margin: auto;
  margin-top: 10vh;
  padding: 20px;

  @media screen and (max-width: 768px) {
    max-width: 70%;
    margin-top: 20vh;
  }

  &__logo {
    display: block;
    margin: auto;
    margin-bottom: 10px;
    max-width: 30vh;
  }

  &__checkbox {
  }

  &__input.custom-label {
    
  }

  &__input::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &__input:focus::placeholder {
    color: rgba(0, 0, 0, 0.8);
  }
}
</style>
