import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import { Message } from 'element-ui';
import utils from '../utils/utils';
import Layout from '@/layout'
import Org from '@/views/org'
import Dashborad from '@/views/dashboard'
import Role from '@/views/role'
import custom from '@/views/custom'
import menu from '@/views/menu'
import user from '@/views/user'
import Notfound from '../layout/components/Notfound'
import Forbidden from '../layout/components/Forbidden'
import 'nprogress/nprogress.css'

var userApi = require('../api/user');
Vue.use(Router)

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/login') },
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
        path: '/jobs',
        name: 'jobs',
        component: () => import('../views/jobs')
      },
      {
        path: '/role',
        name: 'role',
        component: Role,
      },
      { path: '/custom', name: 'custom', component: custom },
      { path: '/menu', name: 'menu', component: menu},
      { path: '/user', name: 'user', component: user },
      {
        path: '/system', name: 'system', component: () => import('../views/system'),
        children: [
          
        ]
      }
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
  { path: '/initialize', name: 'systemInitialize', component: () => import('../views/system/initialize') },
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
  NProgress.start();
  const store = router.app.$options.store;
  const loginToken = utils.getLoginToken();

  // 判断路由是否存在
  if (to.name === undefined) {
    return next({
      path: '/404',
      query: { redirect: to.fullPath }
    });
  }
  // 判断用户是否登录
  if (!loginToken || loginToken === '' ) {
    if (['login', 'Forbidden', 'Notfound'].includes(to.name)) {//如果是登录页面路径，就直接next()
      next();
    } else {//不然就跳转到登录；
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // userApi.default.getMenus("5db072d32b51c6a8de6c9133").then(res => {
    //   console.log(res);
    // });
    next();
  }
});

router.afterEach(transition => {
  NProgress.done();
})

export default router;