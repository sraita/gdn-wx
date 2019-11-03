import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  name: 'order',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'order',
      component: () => import('@/views/order'),
      meta: { title: '订单管理', icon: 'documentation', affix: true }
    },
  ]
};

export default orderRouter