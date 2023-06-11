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
      meta: { requiresAuth: false },
    },
    {
      path: '/presetup',
      name: 'ProfilePresetup',
      component: () => import('@/views/ProfilePresetup.vue'),
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
      component: () => import('@/components/ProfileComponents/Skills/WeakSkillsPage.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/strong-skill',
      name: 'StrongSkillsPage',
      component: () => import('@/components/ProfileComponents/Skills/StrongSkillsPage.vue'),
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
      path: '/chat',
      name: 'Chat',
      component: () => import('@/views/DealChat.vue'),
      meta: { requiresAuth: true },
    }, 
  ],
})

router.beforeEach((to, from, next) => {
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
  const isProfilePresetup = store.state.auth.user?.isPreSetup;

  if (!loggedIn && requiresAuth) {
    next('/');
  } 

  else if (loggedIn) {
    if (!isProfilePresetup) {
      if (to.path !== '/presetup') {
        next({ path: '/presetup', replace: true });
      } else {
        next();
      }
    } else {
      if (to.path === '/presetup') {
        next({ path: '/home', replace: true });
      } else if (to.path === '/') {
        next({ path: '/home', replace: true });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});



export default router
