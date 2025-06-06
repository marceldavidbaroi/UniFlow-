<template>
  <div class="col-12 col-md-6 col-lg-4">
    <q-card class="table-card">
      <q-card-section class="table-header row items-center justify-between q-pb-sm">
        <div class="row items-center">
          <q-icon :name="icon" class="q-mr-sm" color="primary" />
          <div class="text-subtitle1 text-weight-medium">{{ title }}</div>
        </div>
        <div class="text-caption text-grey-8">
          {{ rows?.length || 0 }} item{{ rows?.length === 1 ? '' : 's' }}
        </div>
      </q-card-section>

      <q-table
        dense
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        hide-pagination
        class="styled-table"
        @row-click="onRowClick"
      >
        <template v-slot:no-data>
          <div class="text-grey text-caption q-pa-md text-center">
            No {{ title.toLowerCase() }} found.
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  rows: Array,
  columns: Array,
})

const emit = defineEmits(['row-click'])

function onRowClick(evt, row) {
  emit('row-click', row)
}
</script>

<style scoped lang="scss">
.table-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.table-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.table-header {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem;
  background-color: #f0f0f0;
}

::v-deep(.styled-table thead tr) {
  background-color: #e0e0e0;
  color: #2e2e2e;
  font-weight: 600;
}

::v-deep(.styled-table tbody tr:nth-child(odd)) {
  background-color: #fafafa;
}

::v-deep(.styled-table tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

::v-deep(.styled-table tbody tr:hover) {
  background-color: #f2f8ff;
  transition: background-color 0.2s;
}
</style>
