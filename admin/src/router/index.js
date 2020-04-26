import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
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
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'authorization',
      roles: ['admin', 'editor','5ea435e9189f7b2eae7fb4d6'] // you can set roles in root nav
    },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/permission/menu'),
        name: 'Menu',
        meta: {
          title: '菜单管理',
          roles: ['admin','5ea435e9189f7b2eae7fb4d6'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色权限',
          roles: ['admin','5ea435e9189f7b2eae7fb4d6']
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'user-manage', affix: true},
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: '用户列表', icon: 'user', affix: true },
      },
      {
        path: 'create',
        component: () => import('@/views/user/create'),
        name: 'User',
        meta: { title: '新增用户', icon: 'user-manage', affix: true },
      }
    ]
  },
  {
    path: '/translator',
    component: Layout,
    redirect: '/translator/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/translator/index'),
        name: 'Translator',
        meta: { title: '译员管理', icon: 'translator', affix: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    // redirect: '/order/index',
    meta: { title: '订单管理', icon: 'order', affix: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'OrderIndex',
        meta: { title: '订单列表', icon: '', affix: true }
      },
      {
        path: 'statistic',
        component: () => import('@/views/order/statistic'),
        name: 'OrderStatistic',
        meta: { title: '订单统计', icon: '', affix: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/index'),
        name: 'System',
        meta: { title: '系统设置', icon: 'settings', affix: true }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/log/index'),
        name: 'Log',
        meta: { title: '日志查询', icon: 'log', affix: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
