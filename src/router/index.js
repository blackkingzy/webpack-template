import { createRouter, createWebHistory } from 'vue-router'
import layout from '@/layout/index.vue'
import welcome from '@/pages/welcome.vue'

const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        component: welcome,
      },
    ],
  },
]

export default createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})
