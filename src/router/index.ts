import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/level/0'
    },

    {
      path: '/level/:levelID',
      name: 'game',
      component: GameView
    }
  ]
})

export default router
