export default [
  {
    path: '/group',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: 'create',
        component: () => import('./pages/CreateGroupIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
      {
        path: 'list',
        component: () => import('./pages/GroupListIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student'],
        },
      },
      {
        path: ':id',
        component: () => import('./pages/GroupDetailsIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student', 'admin'],
        },
      },
      {
        path: 'join/:id',
        component: () => import('./pages/GroupJoinIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher', 'student'],
        },
      },
      {
        path: 'edit/:id',
        component: () => import('./pages/EditGroupDetails.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
    ],
  },
]
