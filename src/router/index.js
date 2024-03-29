import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import jwtDecode from 'jwt-decode';

import Home from '@/views/HomePage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { public: true },
    },
    {
      path: '/profile_setup',
      name: 'ProfileSetup',
      component: () => import('@/views/ProfileSetup.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/matching',
      name: 'MatchingUsers',
      component: () => import('@/views/MatchingUsers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/user/:userId',
      name: 'UserProfile',
      component: () => import('@/views/UserProfile.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/weak-skill',
      name: 'WeakSkillsPage',
      component: () => import('@/components/ProfileComponents/WeakSkillsPage.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/strong-skill',
      name: 'StrongSkillsPage',
      component: () => import('@/components/ProfileComponents/StrongSkillsPage.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/chats',
      name: 'Chats_Page',
      component: () => import('@/views/AllChatsPage.vue'),
      meta: { requiresAuth: true },
    }, 
    {
      path: '/:chatId([0-9a-zA-Z-_]+)',
      name: 'Chat',
      component: () => import('@/views/DealChat.vue'),
      props: route => ({ chatId: route.params.chatId }),
      meta: { requiresAuth: true },
    }, 
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
      await router.push('/home');
    } else if (to.name === 'Login' && loggedIn) { // Добавьте эту проверку
      await router.push('/home');
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    await router.push('/');
  }
});

export default router
