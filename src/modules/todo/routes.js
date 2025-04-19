export default [
  {
    path: '/todos',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/TodoIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student'],
        },
      },
    ],
  },
]
