import Vue from 'vue'
import VueRouter from 'vue-router'
import Offsets from '../views/Offsets'
import Movement from '../views/Movement'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Offsets',
    component: Offsets
  },
  {
    path: '/movement',
    name: 'Movement',
    component: Movement
  },
]

const router = new VueRouter({
  routes
})

export default router
