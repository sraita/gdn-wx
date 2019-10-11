import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/page/layout'
import Org from '@/page/org'
import Dashborad from '@/page/dashboard'
import Role from '@/page/role'
import custom from '@/page/custom'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: 'login', component:() => import('../page/login')},
    {
      path: '/',
      name: 'Index',
      component: Layout,
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
        },
        { path: '/custom', name: 'custom', component: custom}
      ]
    }
  ]
})
