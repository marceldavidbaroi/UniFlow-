<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="q-py-none" style="background: rgba(255, 255, 255, 0)">
      <!-- <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-img src="/public//images/Logo-nav.svg" height="50px" width="150px" />
        </q-toolbar-title>

        <div>
          <ClockCard />
        </div>
      </q-toolbar> -->
      <HeaderCard @toggle-drawer="toggleDrawer" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      show-if-above
      elevated
      class="bg-accent"
    >
      <q-scroll-area
        :style="
          miniState
            ? 'height: calc(100% - 50px); margin-top: 50px; border-right: 1px solid #ddd'
            : 'height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd'
        "
      >
        <q-list>
          <!-- <q-item-label> Essential Links </q-item-label>
        <q-item-label header> Essential Links </q-item-label> -->
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
            <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
            <q-icon
              name="account_circle"
              :size="miniState ? '30px' : '56px'"
              class="q-mb-sm text-secondary"
            />
          </q-avatar>
          <div class="text-bold text-secondary text-h6 brand_sb">
            {{ userStore.currentUser.name }}
            <span
              v-if="userStore.currentUser.faculty.label"
              class="text-secondary text-caption brand_sb"
            >
              [{{ userStore.currentUser.faculty.label }}]
            </span>
          </div>
          <div class="text-secondary text-caption brand_sb">
            {{ userStore.currentUser.email }}
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

  { title: 'Logout', icon: 'logout', link: '/auth/logout' },
]
const linksList = authStore.isAuthenticated
  ? userStore.currentRole === 'teacher'
    ? teacherLinks
    : userStore.currentRole === 'student'
      ? studentLinks
      : visitorLinks
  : visitorLinks

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
