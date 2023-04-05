import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import jwtDecode from 'jwt-decode';

import LoginPage from '@/views/LoginPage.vue'
import ProfileSetup from '@/views/ProfileSetup.vue'
import ProfilePage from '@/views/ProfilePage.vue'
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
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/skill/:id',
    //   name: 'SkillDetails',
    //   component: SkillDetails,
    //   props: true,
    // },
  ],
})

router.beforeEach(async (to, from, next) => {
  const token = store.state.auth.token;
  let loggedIn = false;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      loggedIn = decodedToken.exp > Date.now() / 1000;
    } catch (e) {
      loggedIn = false;
    }
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isPublic = to.matched.some(record => record.meta.public);
  const isProfileSetup = store.state.auth.user?.availability;

  try {
    if (requiresAuth && !loggedIn) {
      throw new Error('Unauthorized');
    } else if (isPublic && loggedIn && !isProfileSetup) {
      await router.push('/profile_setup');
    } else if (to.name === 'ProfileSetup' && isProfileSetup) {
      await router.push('/profile');
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    await router.push('/');
  }
});

export default router
