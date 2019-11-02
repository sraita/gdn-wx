import Layout from '@/layout';

const workflowRouter = {
  path:'/workflow',
  name:'workFlow',
  component: Layout,
  children:[
    {
      path:'index',
      name: 'workFlowIndex',
      component: () => import('@/views/workflow/index'),
      meta:{title: '工作流'}
    },
    {
      path: 'category',
      name: 'workFlowCategory',
      component: () => import('@/views/workflow/category'),
      meta: { title: '模型分类管理' }
    },
    {
      path: ':_id/design',
      name: 'designWorkFlow',
      component: () => import('@/views/workflow/design/index'),
      meta: { title: '流程设计' }
    },
  ]
}

export default workflowRouter;