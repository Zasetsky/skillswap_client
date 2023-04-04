<template>
  <div class="sign-in-form">
    <v-img src="../../assets/images/swp_logo.png" class="sign-in-form__logo" />
    <v-form @submit.prevent="login" @keydown.native.enter="submitOnEnter" ref="form">
      <v-text-field
          label="Email"
          v-model="email"
          class="sign-in-form__input email-custom-outline"
          :error-messages="emailErrors"
          @input="onEmailInput"
          @blur="$v.email.$touch()"
          outlined
          list="saved-emails"
      ></v-text-field>
      <datalist id="saved-emails" ref="savedEmailsList">
        <option v-for="email in savedEmails" :key="email" :value="email"></option>
      </datalist>

      <v-text-field
        label="Password"
        outlined
        v-model="password"
        class="sign-in-form__input password-custom-outline"
        :placeholder="'Password'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @blur="$v.password.$touch()"
        :error-messages="passwordErrors"
        @input="resetLoginError"
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
      <span class="switch-form-text">Don't have an account yet?<a @click="$emit('switch-to-signup')" class="switch-form-link">Sign up</a></span>
    </v-form>
  </div>
</template>
<script>
import { required, email, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'SignInForm',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      remember: false,
      savedEmails: [],
      loginError: false,
    };
  },

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6), matches: value => /^[a-zA-Z0-9!@#$%^&*()_+-=.,<>?/;:'"[\]{}|`~]+$/.test(value), },
  },

  computed: {
    isFormValid() {
      return !this.$v.email.$invalid && !this.$v.password.$invalid;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Invalid email');
      !this.$v.email.required && errors.push('Email is required');
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (this.loginError) {
        errors.push('Неправильный email или пароль');
      }
      if (this.$v.password.$error) {
        if (!this.$v.password.required) {
          errors.push('Пароль обязателен');
        } else if (!this.$v.password.minLength) {
          errors.push('Пароль должен содержать не менее 6 символов');
        } else if (!this.$v.password.matches) {
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

    async login() {
      this.$v.$touch();

      if (this.isFormValid) {
        try {
          const response = await this.$store.dispatch('auth/login', {
            email: this.email,
            password: this.password,
          });

          console.log('User logged in:', response);

          // Сохранён ли уже email
          if (!this.savedEmails.includes(this.email)) {
            this.savedEmails.push(this.email);
            localStorage.setItem('savedEmails', JSON.stringify(this.savedEmails));
          }

          // Очистка полей
          this.email = '';
          this.password = '';
          this.remember = false;
          this.$v.$reset();

          // Обработка входа, например, перенаправление на другую страницу
          this.$router.push('/profile_setup'); // Измените на маршрут, на который хотите перенаправить пользователя после входа

        } catch (error) {
          // Обработка ошибок входа, например, показ сообщения об ошибке
          console.error('Error during login:', error);
          if (error.response && (error.response.status === 401 || error.response.status === 404 || error.response.status === 400)) {
            this.loginError = true;
            this.password = '';
          }
        }
      }
    },

    submitOnEnter(event) {
      if (event.keyCode === 13 && this.isFormValid) {
        this.login();
      }
    },

    resetLoginError() {
      this.loginError = false;
    },

    onEmailInput() {
      this.$v.email.$touch();
      if (this.savedEmails.includes(this.email)) {
        this.$refs.savedEmailsList.innerHTML = '';
      } else {
        this.$refs.savedEmailsList.innerHTML = this.savedEmails.map(email => `<option value="${email}"></option>`).join('');
      }
    },
  },

  created() {
    const savedEmails = localStorage.getItem('savedEmails');
    if (savedEmails) {
      this.savedEmails = JSON.parse(savedEmails);
    }
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
  text-align: center;

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
