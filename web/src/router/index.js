import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import Org from '@/page/org'
import Dashborad from '@/page/dashboard'
import Role from '@/page/role'
import custom from '@/page/custom'
import Notfound from '../layout/components/Notfound'
import Forbidden from '../layout/components/Forbidden'
Vue.use(Router)

const routes = [
  { path: '/login', name: 'login', component: () => import('../page/login') },
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
      { path: '/custom', name: 'custom', component: custom }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      title: '无权访问'
    }
  },
  {
    path: '/404',
    name: 'Notfound',
    component: Notfound,
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
];
const router = new Router({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  console.log(router);
  console.log(to, from)
  const store = router.app.$options.store;
  // 判断路由是否存在
  if (to.name === undefined) {
    return next({
      path: '/404',
      query: { redirect: to.fullPath }
    });
  }
  // 判断用户是否登录
  if (store.state.user.token === '') {
    if (['login', 'Forbidden','Notfound'].includes(to.name)) {//如果是登录页面路径，就直接next()
      next();
    } else {//不然就跳转到登录；
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
})

export default router;