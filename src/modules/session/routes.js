export default [
  {
    path: '/session',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateSessionIndex.vue') },
      { path: 'list', component: () => import('./pages/SessionList.vue') },
      { path: 'teacher/:id', component: () => import('./pages/SessionDetailsTeacher.vue') },
      { path: 'join/:id', component: () => import('./pages/SessionJoinIndex.vue') },
    ],
  },
]
