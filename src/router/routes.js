export default [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import(/* webpackChunkName: 'index' */ '../views/Index/Index.vue')
  },
  {
    path: '/test',
    component: () => import(/* webpackChunkName: 'test' */ '../views/Test/Test.vue')
  }
]
