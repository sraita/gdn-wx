import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

/* Router Modules */
import authRouter from './modules/auth';

import Notfound from '../layout/components/Notfound'
import Forbidden from '../layout/components/Forbidden'



var userApi = require('../api/modules/user');
Vue.use(Router)


export const constantRoutes = [
  { path: '/login', name: 'login', component: () => import('../views/login') },
  { path: '/403', name: 'Forbidden', component: Forbidden, meta: {title: '无权访问'}},
  { path: '/404', name: 'Notfound', component: Notfound, meta: {title: '页面不存在'}},
  { path: '/initialize', name: 'systemInitialize', component: () => import('../views/system/initialize') },
  { path: '*', redirect: '/404'},
  // dashboard
  {
    path: '/',
    name: 'dashboard',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    meta: { title: '系统管理', icon: 'documentation', affix: true },
    children: [
      {
        path: '/initialize',
        name: 'systemInitialize',
        component: () => import('../views/system/initialize'),
        meta: { title: '初始化', icon: 'documentation', affix: true }
      },
    ]
  }
];
//动态路由(所有角色的都在这里,我们都做好组件页面了所以我们一定有这个，防君子不防小人)
export const dynamicRoutes = [
  
  authRouter,// 权限管理
  {
    path: '/user',
    name: 'user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('../views/user'),
        meta: { title: '初始化', icon: 'documentation', affix: true }
      },
    ]
  },
  {
    path: '/custom',
    name: 'custom',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'custom',
        component: () => import('../views/custom'),
        meta: { title: '客户管理', icon: 'documentation', affix: true }
      },
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    meta: { title: '系统管理', icon: 'documentation', affix: true },
    children: [
      {
        path: '/initialize',
        name: 'systemInitialize',
        component: () => import('../views/system/initialize'),
        meta: { title: '初始化', icon: 'documentation', affix: true }
      },
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter();


export default router;