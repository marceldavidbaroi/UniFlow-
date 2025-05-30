<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="q-py-none" style="background: rgba(255, 255, 255, 0)">
      <HeaderCard @toggle-drawer="toggleDrawer" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      show-if-above
      class="bg-white"
    >
      <q-scroll-area
        :style="
          miniState
            ? 'height: calc(100% - 50px); margin-top: 50px; border-right: 1px solid #ddd'
            : 'height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd'
        "
      >
        <q-list>
          <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="/public//images//auth-bg-white-150.png"
        :style="miniState ? 'height: 50px' : 'height: 150px'"
      >
        <div
          class="absolute-bottom bg-transparent"
          style="background: rgba(255, 255, 255, 0.164); backdrop-filter: blur(5px)"
          :style="miniState ? 'height: 50px' : 'height: 150px'"
        >
          <q-avatar :size="miniState ? '30px' : '56px'" class="q-mb-sm">
            <q-icon
              name="account_circle"
              :size="miniState ? '30px' : '56px'"
              class="q-mb-sm text-secondary"
            />
          </q-avatar>
          <div class="text-bold text-secondary text-h6 brand_sb">
            {{ userStore.currentUser?.name }}
            <span
              v-if="userStore.currentRole === 'teacher'"
              class="text-secondary text-caption brand_sb"
            >
              [{{ userStore.currentUser?.faculty.label }}]
            </span>
          </div>
          <div class="text-secondary text-caption brand_sb">
            {{ userStore.currentUser?.email }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container class="bg-accent">
      <router-view />
    </q-page-container>

    <FooterCard />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useUserStore } from 'src/stores/user-store'

import EssentialLink from 'components/EssentialLink.vue'
// import ClockCard from 'src/components/ClockCard.vue'
import FooterCard from 'src/components/FooterCard.vue'
import HeaderCard from 'src/components/HeaderCard.vue'

const authStore = useAuthStore()
const userStore = useUserStore()

const leftDrawerOpen = ref(false)
const miniState = ref(true)
// links
const visitorLinks = [
  { title: 'Home', icon: 'fa-solid fa-house', link: '/home' },
  { title: 'Login', icon: 'login', link: '/auth/login' },
]

const teacherLinks = [
  { title: 'Dashboard', icon: 'dashboard', link: '/dashboard/teacher' },
  {
    title: 'Group',
    icon: 'groups',
    subMenu: [
      { title: 'Create Group', icon: 'add_circle', link: '/group/create' },
      { title: 'Group List', icon: 'view_list', link: '/group/list' },
    ],
  },
  {
    title: 'Session',
    icon: 'event',
    subMenu: [
      { title: 'Create Session', icon: 'add_circle', link: '/session/create' },
      { title: 'Session List', icon: 'view_list', link: '/session/list' },
    ],
  },
  {
    title: 'Tasks',
    icon: 'event',
    subMenu: [
      { title: 'Create tasks', icon: 'add_circle', link: '/tasks/add' },
      { title: 'Task List', icon: 'view_list', link: '/tasks' },
    ],
  },
  { title: 'Todo List', icon: 'checklist', link: '/todos' },

  { title: 'Logout', icon: 'logout', link: '/auth/logout' },
]

const studentLinks = [
  { title: 'Dashboard', icon: 'dashboard', link: '/dashboard/student' },
  {
    title: 'Group',
    icon: 'groups',
    subMenu: [{ title: 'Group List', icon: 'view_list', link: '/group/list' }],
  },
  {
    title: 'Session',
    icon: 'event',
    subMenu: [{ title: 'Session List', icon: 'view_list', link: '/session/list' }],
  },
  {
    title: 'Tasks',
    icon: 'task_alt',
    subMenu: [{ title: 'Task List', icon: 'view_list', link: '/tasks' }],
  },
  { title: 'Todo List', icon: 'checklist', link: '/todos' },

  { title: 'Logout', icon: 'logout', link: '/auth/logout' },
]

const adminLinks = [
  { title: 'Admin Dashboard', icon: 'dashboard', link: '/admin' },
  {
    title: 'AcademicEntity',
    icon: 'account_tree',
    subMenu: [
      { title: 'Courses', icon: 'menu_book', link: '/admin/course' },
      { title: 'Department', icon: 'apartment', link: '/admin/department' },
      { title: 'Faculty', icon: 'school', link: '/admin/faculty' },
    ],
  },
  { title: 'Users', icon: 'people', link: '/admin/users' },
  { title: 'Groups', icon: 'groups', link: '/admin/groups' },
  { title: 'Sessions', icon: 'event', link: '/admin/sessions' },
  { title: 'Tasks', icon: 'assignment', link: '/admin/tasks' },
  { title: 'To-Do', icon: 'checklist', link: '/admin/todo' },
  { title: 'Notes', icon: 'note', link: '/admin/notes' },
  { title: 'Subjects', icon: 'book', link: '/admin/subjects' },
  { title: 'Logs', icon: 'list_alt', link: '/admin/logs' },

  { title: 'Logout', icon: 'logout', link: '/auth/logout' },
]

const linksList = authStore.isAuthenticated
  ? userStore.currentRole === 'teacher'
    ? teacherLinks
    : userStore.currentRole === 'student'
      ? studentLinks
      : adminLinks
  : visitorLinks

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
