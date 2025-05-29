export default [
  {
    path: '/tasks',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'task',
        component: () => import('./pages/TaskIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student'],
        },
      },
      {
        path: 'add',
        name: 'task-add',
        component: () => import('./components/AddTask.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
      {
        path: 'submit/:taskId',
        name: 'task-submit',
        component: () => import('./pages/TaskSubmission.vue'),
        meta: {
          requiresAuth: true,
          roles: ['student', 'teacher'],
        },
      },
    ],
  },
]
