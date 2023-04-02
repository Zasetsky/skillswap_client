<template>
    <div class="sign-up-form">
      <v-img src="../../assets/images/swp_logo.png" class="sign-up-form__logo" />
      <v-form @submit.prevent="register" @keydown.native.enter="submitOnEnter" ref="form">
        <v-text-field
          label="Email"
          v-model="email"
          class="sign-up-form__input email-custom-outline"
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          outlined
        ></v-text-field>
  
        <v-text-field
          label="Password"
          v-model="password"
          class="sign-up-form__input password-custom-outline"
          :placeholder="'Password'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @blur="$v.password.$touch()"
          :error-messages="passwordErrors"
          @focus="onFocus"
          outlined
        ></v-text-field>

        <v-text-field
            label="Repeat Password"
            v-model="repeatPassword"
            class="sign-up-form__input repeat-password-custom-outline"
            :placeholder="'Repeat Password'"
            :type="showRepeatPassword ? 'text' : 'password'"
            @click:append="showRepeatPassword = !showRepeatPassword"
            :append-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @blur="$v.repeatPassword.$touch()"
            :error-messages="repeatPasswordErrors"
            @focus="onFocus"
            outlined
        ></v-text-field>

        <v-alert v-if="registerError" type="error"> <!-- Потом доделаю! -->
          A user with this email already exists.
        </v-alert>     
  
        <v-btn
          :color="getButtonColor()"
          class="sign-up-form__button"
          block
          :disabled="!isFormValid"
          @click="register"
        >
          Register
        </v-btn>
        <span class="switch-form-text">Already have an account?<a @click="$emit('switch-to-signin')" class="switch-form-link">Sign in</a></span>
      </v-form>
    </div>
</template>
  
<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'SignUpForm',
  data() {
      return {
          email: '',
          password: '',
          showPassword: false,
          repeatPassword: '',
          showRepeatPassword: false,
          registerError: false,
      };
  },
  validations: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      repeatPassword: { required, sameAsPassword: sameAs('password') },
  },
  computed: {
      isFormValid() {
          return !this.$v.$invalid;
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
          if (!this.$v.password.$dirty) return errors;
          !this.$v.password.minLength && errors.push('Password must be at least 6 characters long');
          if (!this.registerError) {
            !this.$v.password.required && errors.push('Password is required');
          }
          return errors;
      },

      repeatPasswordErrors() {
          const errors = [];
          if (!this.$v.repeatPassword.$dirty) return errors;
          if (!this.registerError) {
            !this.$v.password.required && errors.push('Repeat password is required');
          }
          !this.$v.repeatPassword.sameAsPassword && errors.push('Passwords do not match');
          return errors;
      },
  },
  methods: {
    getButtonColor() {
        return this.isFormValid ? '#f8a201' : 'grey darken-1';
    },

    async register() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          const response = await this.$store.dispatch('auth/register', {
            email: this.email,
            password: this.password,
          });

          console.log('User registered:', response);

          // Авторизация пользователя
          await this.$store.dispatch('auth/login', {
            email: this.email,
            password: this.password,
          });

          // Очистка полей
          this.email = '';
          this.password = '';
          this.repeatPassword = '';
          this.registerError = false;
          this.$v.$reset();

          // Перенаправление на страницу настройки профиля
          this.$router.push('/profile_setup');
        } catch (error) {
          if (error.response && error.response.status === 400) {
            // Пользователь с таким email уже существует
            this.password = '';
            this.repeatPassword = '';
            this.registerError = true;
          } else {
            // Обработка других ошибок регистрации, например, показ сообщения об ошибке
            console.error('Error during registration:', error);
          }
        }
      }
    },

    submitOnEnter(event) {
      if (event.keyCode === 13 && this.isFormValid) {
        this.register();
      }
    },

    onFocus() {
      this.registerError = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-up-form {
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

  &__input::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  &__input:focus::placeholder {
    color: rgba(0, 0, 0, 0.8);
  }
}
</style>  