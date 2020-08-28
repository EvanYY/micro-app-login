export default [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('@/pages/error/404.vue')
  }

]
