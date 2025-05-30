<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <div style="position: absolute; left: 32px; top: 32px; z-index: 2">
      <q-btn
        flat
        color="grey"
        icon="arrow_back"
        unelevated
        label="Back"
        class="q-px-md q-py-xs rounded-borders text-weight-medium"
        style="font-size: 1.08em; letter-spacing: 0.5px; min-width: 110px"
        @click="goBack"
      />
    </div>
    <q-card
      class="modern-faculty-card q-pa-xl q-mt-xl q-mb-xl shadow-10"
      style="max-width: 520px; width: 100%; border-radius: 24px"
    >
      <q-card-section class="row items-center q-gutter-md q-pb-none">
        <q-avatar
          size="72px"
          color="primary"
          text-color="white"
          class="q-mr-md text-weight-bold shadow-4"
          style="border-radius: 16px"
        >
          {{ course.code || '?' }}
        </q-avatar>
        <div>
          <div class="text-h5 text-weight-bold text-primary">{{ course.name }}</div>
          <div class="text-subtitle2 text-grey-7 q-mt-xs">
            Code: <span class="text-weight-medium">{{ course.code }}</span>
          </div>
        </div>
      </q-card-section>
      <q-separator spaced color="grey-3" />
      <q-card-section class="q-gutter-md q-pt-none">
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="person" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Head of course</span>
            <div class="text-grey-8">{{ course.headOfFaculty }}</div>
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="email" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Email</span>
            <q-btn
              flat
              dense
              color="primary"
              class="q-ml-xs q-pl-none"
              style="justify-content: flex-start; width: fit-content"
              :label="course.email"
              no-caps
              :href="'mailto:' + course.email"
            />
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="phone" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Phone</span>
            <div class="text-grey-8">{{ course.phone }}</div>
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="location_on" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Office</span>
            <div class="text-grey-8">{{ course.officeLocation }}</div>
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="public" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Website</span>
            <q-btn
              flat
              dense
              color="secondary"
              icon="open_in_new"
              :href="course.website"
              style="width: 20px"
              target="_blank"
              class="q-ml-xs"
            />
          </q-item-section>
        </q-item>
        <q-item dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon name="description" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">Description</span>
            <div class="text-grey-8">{{ course.description }}</div>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

onMounted(async () => {
  const courseId = route.params.id
  console.log(courseId)
  if (courseId) {
    await adminStore.getCourseById(courseId)
  }
  console.log(adminStore.selectedCourse)
})

const course = computed(() => adminStore.selectedCourse || {})

function goBack() {
  router.push('/admin/faculty')
}
</script>

<style scoped>
.modern-faculty-card {
  background: linear-gradient(135deg, #f8fafd 0%, #e3f0ff 100%);
  box-shadow: 0 8px 32px 0 rgba(60, 80, 180, 0.1);
  border: 1.5px solid #e3eaf7;
}
</style>
