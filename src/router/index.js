import Vue from 'vue'
import VueRouter from 'vue-router'
import Monitor from '@/components/Monitor'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Monitor',
      component: Monitor
    }
  ]
})
