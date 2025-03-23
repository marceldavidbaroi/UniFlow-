export default [
  {
    path: '/dashboard',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: 'student', component: () => import('./pages/DashboardStudentIndev.vue') },
      { path: 'teacher', component: () => import('./pages/DashboardTeacherIndex.vue') },
      { path: 'admin', component: () => import('./pages/DashboardAdminIndex.vue') },
    ],
  },
]
