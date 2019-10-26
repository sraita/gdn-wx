import Layout from '@/layout'

const authRouter = {
  path: '/auth',
  component: Layout,
  children: [
    {
      path: 'org',
      name: 'org',
      component: () => import('@/views/auth/org'),
      meta: { title: '组织机构', icon: 'documentation', affix: true }
    },
    {
      path: 'jobs',
      name: 'jobs',
      component: () => import('@/views/auth/jobs'),
      meta: { title: '岗位管理', icon: 'documentation', affix: true }
    },
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