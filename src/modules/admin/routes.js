// Quasar route config for admin module
export default [
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/AdminDashboardIndex.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'users',
        component: () => import('./pages/AdminUserList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'groups',
        component: () => import('./pages/AdminGroupList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'sessions',
        component: () => import('./pages/AdminSessionList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'tasks',
        component: () => import('./pages/AdminTaskList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'todo',
        component: () => import('./pages/AdminTodoList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'notes',
        component: () => import('./pages/AdminNoteList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'subjects',
        component: () => import('./pages/AdminSubjectList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'logs',
        component: () => import('./pages/AdminLogList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'faculty',
        component: () => import('./pages/AdminFacultyList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'faculty/:id',
        component: () => import('./pages/AdminFacultyDetail.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'course',
        component: () => import('./pages/AdminCourseList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'course/:id',
        component: () => import('./pages/AdminCourseDetail.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'department',
        component: () => import('./pages/AdminDepartmentList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'department/:id',
        component: () => import('./pages/AdminDepartmentDetail.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
    ],
  },
]
