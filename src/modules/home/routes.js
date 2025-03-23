export default [
  {
    path: '/home',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('./pages/HomeIndex.vue') }],
  },
]
