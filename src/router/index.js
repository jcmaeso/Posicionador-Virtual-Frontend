import Vue from 'vue'
import VueRouter from 'vue-router'
import Offsets from '../views/Offsets'
import Movement from '../views/Movement'
import Limits from '../views/Limits'


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
  {
    path: '/limits',
    name: 'Limits',
    component: Limits
  },
]

const router = new VueRouter({
  routes
})

export default router
