export default [
  {
    path: '/tasks',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/TaskIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student'],
        },
      },
      {
        path: 'add',
        component: () => import('./components/AddTask.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
    ],
  },
]
