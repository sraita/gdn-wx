import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/Index'
import Org from '@/page/org'
import Dashborad from '@/page/dashboard'
import Role from '@/page/role'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: Dashborad
        },
        {
          path: '/org',
          name: 'org',
          component: Org,
        },
        {
          path: '/role',
          name: 'role',
          component: Role, 
        }
      ]
    }
  ]
})
