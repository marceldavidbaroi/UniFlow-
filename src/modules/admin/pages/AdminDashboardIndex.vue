<template>
  <q-page padding>
    <div class="text-h4 text-weight-bold q-mb-md">Admin Dashboard</div>
    <div class="row q-col-gutter-md">
      <q-card class="col-12 col-md-4 q-pa-md" v-for="card in cards" :key="card.title">
        <q-icon :name="card.icon" size="36px" color="primary" class="q-mb-sm" />
        <div class="text-h6 text-weight-bold">{{ card.title }}</div>
        <div class="text-caption text-grey-7">{{ card.desc }}</div>
        <q-btn :to="card.link" color="primary" flat class="q-mt-sm" label="View" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
const cards = [
  { title: 'Users', icon: 'people', desc: 'Manage all users', link: '/admin/users' },
  { title: 'Groups', icon: 'groups', desc: 'Manage groups', link: '/admin/groups' },
  { title: 'Sessions', icon: 'event', desc: 'Manage sessions', link: '/admin/sessions' },
  { title: 'Tasks', icon: 'assignment', desc: 'Manage tasks', link: '/admin/tasks' },
  { title: 'To-Do', icon: 'checklist', desc: 'Manage to-do items', link: '/admin/todo' },
  { title: 'Notes', icon: 'note', desc: 'Manage notes', link: '/admin/notes' },
  { title: 'Subjects', icon: 'book', desc: 'Manage subjects', link: '/admin/subjects' },
  { title: 'Logs', icon: 'list_alt', desc: 'View system logs', link: '/admin/logs' },
]
</script>
