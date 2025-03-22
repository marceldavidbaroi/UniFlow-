export default [
  {
    path: '/',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [{ path: 'login', component: () => import('./pages/loginIndex.vue') }],
  },
]
