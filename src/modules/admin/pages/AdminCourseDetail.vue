<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <DetailsCardComponent
      :title="course.name"
      :code="course.code"
      :avatar-message="course.initial"
      :show-avatar="true"
      :show-code="true"
      :show-back-button="true"
      :backUrl="backURL"
      :items="detailsItems"
    />
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'
import DetailsCardComponent from '../components/DetailsCardComponent.vue'

const route = useRoute()
const adminStore = useAdminStore()
const backURL = '/admin/course'

onMounted(async () => {
  const courseId = route.params.id
  if (courseId) {
    await adminStore.getCourseById(courseId)
  }
})

const course = computed(() => adminStore.selectedCourse || {})

const detailsItems = computed(() => [
  {
    label: 'Head of Course',
    value: course.value.headOfFaculty,
    icon: 'person',
  },
  {
    label: 'Email',
    value: course.value.email,
    icon: 'email',
    link: 'mailto:' + course.value.email,
  },
  {
    label: 'Phone',
    value: course.value.phone,
    icon: 'phone',
  },
  {
    label: 'Office',
    value: course.value.officeLocation,
    icon: 'location_on',
  },
  {
    label: 'Website',
    value: course.value.website,
    icon: 'public',
    link: course.value.website,
  },
  {
    label: 'Description',
    value: course.value.description,
    icon: 'description',
  },
])
</script>

<style scoped>
.modern-faculty-card {
  background: linear-gradient(135deg, #f8fafd 0%, #e3f0ff 100%);
  box-shadow: 0 8px 32px 0 rgba(60, 80, 180, 0.1);
  border: 1.5px solid #e3eaf7;
}
</style>
