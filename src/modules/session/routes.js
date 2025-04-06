export default [
  {
    path: '/session',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateSessionIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher']
        }
       },
      { path: 'list', component: () => import('./pages/SessionList.vue') ,
        meta: {
          requiresAuth: true,
          roles: ['teacher']
        }
      },
      { path: 'teacher/:id', component: () => import('./pages/SessionDetailsTeacher.vue') },
      { path: 'join/:id', component: () => import('./pages/SessionJoinIndex.vue') },
    ],
  },
]
