<template>
    <v-navigation-drawer app dark permanent>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Добавьте дополнительные элементы навигации здесь -->
        <v-list-item @click="handleLogout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'NavbarComponent',
    methods: {
        ...mapActions('auth', ['logout']),
        async handleLogout() {
            try {
                await this.logout(); // Вызываем экшн `logout` из модуля `auth` в хранилище
                this.$router.push('/'); // Перенаправляем пользователя на главную страницу
            } catch (error) {
                console.error(error);
            }
        },
    },
  };
  </script>
  