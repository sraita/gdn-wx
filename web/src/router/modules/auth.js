import Layout from '@/layout'

const authRouter = {
  path: '/auth',
  name: 'auth',
  component: Layout,
  children: [
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/auth/role'),
      meta: { title: '角色管理', icon: 'documentation', affix: true }
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/auth/menu'),
      meta: { title: '菜单管理', icon: 'documentation', affix: true }
    },
  ]
};

export default authRouter