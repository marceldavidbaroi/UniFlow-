export default [
  {
    path: '/group',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'create', component: () => import('./pages/CreateGroupIndex.vue') },
      { path: 'list', component: () => import('./pages/GroupListIndex.vue') },
      { path: '', component: () => import('./pages/GroupDetailsIndex.vue') },
      { path: 'join', component: () => import('./pages/GroupJoinIndex.vue') },

    ],
  },
]
