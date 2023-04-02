import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/signIn',
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: () => import('../views/signIn.vue'),
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: () => import('../views/signUp.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/History.vue'),
    }
  ]
})

