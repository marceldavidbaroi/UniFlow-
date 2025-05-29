<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="q-pa-lg" style="max-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="info" color="secondary" size="32px" class="q-mr-md" />
        <div class="text-h6">Task Features Guide</div>
      </q-card-section>
      <q-card-section>
        <div class="text-body1 q-mb-md">
          Here you can add a variety of details to your task. Features include:
        </div>
        <ul class="q-pl-md">
          <li><b>Subject and Description:</b> Give your task a clear title and details.</li>
          <li><b>Category:</b> Choose the type (Assignment, Project, Quiz, etc.).</li>
          <li><b>Tags:</b> Add relevant tags for filtering and searching.</li>
          <li><b>Deadline:</b> Set a due date and time for the task.</li>
          <li><b>Total Marks:</b> Specify the maximum marks for grading.</li>
          <li><b>Grading Rubric:</b> Define criteria and notes for assessment.</li>
          <li><b>Subtasks:</b> Add multiple subtasks with details, points, and attachments.</li>
          <li><b>Settings:</b> Configure late submissions, grading scheme, and review options.</li>
          <li><b>Announcements:</b> Add important messages related to the task.</li>
          <li><b>Resources:</b> Attach helpful links or files for students.</li>
        </ul>
        <div class="text-caption text-grey-7 q-mt-md">
          Use the form below to fill in as much detail as needed. You can always edit tasks later.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
ul {
  list-style: disc;
}
</style>
