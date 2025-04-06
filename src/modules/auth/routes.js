export default [
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('./pages/LoginIndex.vue') },
      { path: 'signup', component: () => import('./pages/SignupIndex.vue') },
      { path: 'logout', component: () => import('./pages/logoutIndex.vue') },
    ],
  },
]
