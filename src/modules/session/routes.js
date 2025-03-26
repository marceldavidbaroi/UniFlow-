export default [
  {
    path: '/session',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateSessionIndex.vue') },

    ],
  },
]
