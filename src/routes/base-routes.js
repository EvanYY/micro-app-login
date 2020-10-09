import Login from '@/views/Login'
export default [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('@/pages/error/404.vue')
  }

]
