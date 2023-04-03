import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import LoginPage from '@/views/LoginPage.vue'
import ProfileSetup from '@/views/ProfileSetup.vue'
import HomePage from '@/views/HomePage.vue'
// import Swap from '@/views/SwapView.vue'
// import SkillDetails from '@/views/SkillDetails.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: '/profile_setup',
      name: 'ProfileSetup',
      component: ProfileSetup,
      meta: { requiresAuth: true },
    },
    {
      path: '/home',
      name: 'Home',
      component: HomePage,
    },
    // {
    //   path: '/skill/:id',
    //   name: 'SkillDetails',
    //   component: SkillDetails,
    //   props: true,
    // },
  ],
})

router.beforeEach((to, from, next) => {
  const loggedIn = !!store.state.auth.token;
  const isProfileSetUp = store.state.auth.user && store.state.auth.user.isProfileSetUp;
  console.log('isProfileSetUp: ', isProfileSetUp);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isPublic = to.matched.some(record => record.meta.public);

  if (requiresAuth && !loggedIn) {
    return next('/');
  }

  if (isPublic && loggedIn) {
    return next('/profile_setup');
  }

  // if (to.name === 'ProfileSetup' && isProfileSetUp) {
  //   return next('/home'); 
  // }

  next();
});

export default router
