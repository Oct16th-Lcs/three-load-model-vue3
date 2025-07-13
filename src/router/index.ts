import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/panorama',
    },
    {
      path: '/panorama',
      name: '全景看房',
      component: () => import('../views/panoramaViewer.vue'),
    },
    {
      path: '/3dModel',
      name: '3dModel',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/load3dModel.vue'),
    },
    // {
    //   path: '/360house',
    //   name: '全景看房-1',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/house360.vue'),
    // },
  ],
})

export default router
