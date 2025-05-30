<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <DetailsCardComponent
      :title="department.name"
      :code="department.code"
      :avatar-message="department.initial"
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
const backURL = '/admin/department'

onMounted(async () => {
  const departmentId = route.params.id
  if (departmentId) {
    await adminStore.getDepartmentById(departmentId)
    console.log(adminStore.selectedDepartment)
  }
})

const department = computed(() => adminStore.selectedDepartment || {})

const detailsItems = computed(() => [
  {
    label: 'Head of department',
    value: department.value.headOfDepartment,
    icon: 'person',
  },
  {
    label: 'Email',
    value: department.value.email,
    icon: 'email',
    link: 'mailto:' + department.value.email,
  },
  {
    label: 'Phone',
    value: department.value.phone,
    icon: 'phone',
  },
  {
    label: 'Office',
    value: department.value.officeLocation,
    icon: 'location_on',
  },
  {
    label: 'Website',
    value: department.value.website,
    icon: 'public',
    link: department.value.website,
  },
  {
    label: 'Description',
    value: department.value.description,
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
