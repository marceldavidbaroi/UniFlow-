export default [
  {
    path: '/dashboard',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'student', component: () => import('./pages/DashboardStudentIndev.vue'),
        meta: {
          requiresAuth: true,
          roles: ['student']
        }
       },
      { path: 'teacher', component: () => import('./pages/DashboardTeacherIndex.vue'),
        meta: {
          requiresAuth: true,
          roles: ['teacher']
        }
       },
      { path: 'admin', component: () => import('./pages/DashboardAdminIndex.vue') },
    ],
  },
]
