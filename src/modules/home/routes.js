export default [
  {
    path: '/',
    redirect: '/home' // Redirect root path to /home
  },
  {
    path: '/home',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('./pages/HomeIndex.vue') }],
  },
]
