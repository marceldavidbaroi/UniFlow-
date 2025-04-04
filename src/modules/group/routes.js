export default [
  {
    path: '/group',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateGroupIndex.vue') },
      { path: 'list', component: () => import('./pages/GroupListIndex.vue') },
      { path: ':id', component: () => import('./pages/GroupDetailsIndex.vue') },
      { path: 'join/:id', component: () => import('./pages/GroupJoinIndex.vue') },
    ],
  },
]
