import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/LoginView.vue'
// import Profile from '@/views/ProfileView.vue'
// import Swap from '@/views/SwapView.vue'
// import SkillDetails from '@/views/SkillDetails.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: Profile,
    // },
    // {
    //   path: '/swap',
    //   name: 'Swap',
    //   component: Swap,
    // },
    // {
    //   path: '/skill/:id',
    //   name: 'SkillDetails',
    //   component: SkillDetails,
    //   props: true,
    // },
    // {
    //   path: '/login',
    //   name: 'LoginView',
    //   component: LoginView,
    // },
  ],
})

export default router
/*
Home: Главная страница (путь: /), отображающая список навыков.
Profile: Страница профиля пользователя (путь: /profile).
Swap: Страница обмена навыками (путь: /swap).
SkillDetails: Страница с подробной информацией о навыке (путь: /skill/:id). 
В этом маршруте используется параметр :id для передачи идентификатора навыка.
*/