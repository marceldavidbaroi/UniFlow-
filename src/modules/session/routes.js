export default [
  {
    path: '/session',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateSessionIndex.vue') },
      { path: 'list', component: () => import('./pages/SessionList.vue') },
      { path: ':id', component: () => import('./pages/SessionDetailsTeacher.vue') },
    ],
  },
]
