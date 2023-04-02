<template>
    <div class="sign-up-form">
      <v-img src="../assets/images/swp_logo.png" class="sign-up-form__logo" />
      <v-form @submit.prevent="register" ref="form">
        <v-text-field
          label="Email"
          v-model="email"
          :class="{ notEmptyEmail: isNotEmptyEmail }"
          class="sign-up-form__input email-custom-outline"
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          outlined
        ></v-text-field>
  
        <v-text-field
          label="Password"
          v-model="password"
          :class="{ notEmptyPassword: isNotEmptyPassword }"
          class="sign-up-form__input password-custom-outline"
          :placeholder="'Password'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @blur="$v.password.$touch()"
          :error-messages="passwordErrors"
          outlined
        ></v-text-field>

        <v-text-field
            label="Repeat Password"
            v-model="repeatPassword"
            :class="{ notEmptyRepeatPassword: isNotEmptyRepeatPassword }"
            class="sign-up-form__input repeat-password-custom-outline"
            :placeholder="'Repeat Password'"
            :type="showRepeatPassword ? 'text' : 'password'"
            @click:append="showRepeatPassword = !showRepeatPassword"
            :append-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @blur="$v.repeatPassword.$touch()"
            :error-messages="repeatPasswordErrors"
            outlined
        ></v-text-field>
  
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
        };
    },
    validations: {
        email: { required, email },
        password: { required, minLength: minLength(6) },
        repeatPassword: { required, sameAsPassword: sameAs('password') },
    },
    computed: {
        isNotEmptyEmail() {
            return !!this.email;
        },

        isNotEmptyPassword() {
            return !!this.password;
        },

        isNotEmptyRepeatPassword() {
            return !!this.password;
        },

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
            !this.$v.password.required && errors.push('Password is required');
            return errors;
        },

        repeatPasswordErrors() {
            const errors = [];
            if (!this.$v.repeatPassword.$dirty) return errors;
            !this.$v.repeatPassword.required && errors.push('Repeat password is required');
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

                // Очистка полей
                this.email = '';
                this.password = '';
                this.repeatPassword = '';
                this.$v.$reset();

                // Перенаправление на страницу входа (Стоит ли использовать router???)
                this.$emit('switch-to-signin')
                } catch (error) {
                // Обработка ошибок регистрации, например, показ сообщения об ошибке
                console.error('Error during registration:', error);
                }
            }
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