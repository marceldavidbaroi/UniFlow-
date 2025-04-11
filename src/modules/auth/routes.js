export default [
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [
      { name: 'login', path: 'login', component: () => import('./pages/loginIndex.vue') },
      { name: 'signup', path: 'signup', component: () => import('./pages/SignupIndex.vue') },
      { name: 'logout', path: 'logout', component: () => import('./pages/logoutIndex.vue') },
    ],
  },
]
