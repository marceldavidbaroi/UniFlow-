export default [
  {
    path: '/liveShare',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/LiveShareIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'admin', 'student'],
        },
      },
    ],
  },
]
