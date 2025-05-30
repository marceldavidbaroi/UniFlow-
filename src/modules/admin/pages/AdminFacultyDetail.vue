<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <DetailsCardComponent
      :title="faculty.name"
      :code="faculty.code"
      :avatar-message="faculty.initial"
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
const backURL = '/admin/faculty'

onMounted(async () => {
  const facultyId = route.params.id
  if (facultyId) {
    await adminStore.getFacultyById(facultyId)
  }
})
const faculty = computed(() => adminStore.selectedFaculty || {})

const detailsItems = computed(() => [
  {
    label: 'Head of Faculty',
    value: faculty.value.headOfFaculty,
    icon: 'person',
  },
  {
    label: 'Email',
    value: faculty.value.email,
    icon: 'email',
    link: 'mailto:' + faculty.value.email,
  },
  {
    label: 'Phone',
    value: faculty.value.phone,
    icon: 'phone',
  },
  {
    label: 'Office',
    value: faculty.value.officeLocation,
    icon: 'location_on',
  },
  {
    label: 'Website',
    value: faculty.value.website,
    icon: 'public',
    link: faculty.value.website,
  },
  {
    label: 'Description',
    value: faculty.value.description,
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
