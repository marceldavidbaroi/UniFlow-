<template>
  <q-list class="task-list">
    <q-item
      v-for="task in tasks"
      :key="task.taskID"
      clickable
      class="task-card"
      @mouseenter="(event) => handleMouseenter(task, event)"
      @mouseleave="handleMouseleave"
    >
      <q-item-section>
        <div
          :class="['task-status-bar', task.status.toLowerCase().replace(/\s+/g, '-')]"
          class="q-mr-sm"
        />
        <q-item-label class="task-title">{{ task.subject }}</q-item-label>
        <q-item-section>
          <q-select
            v-model="task.status"
            :options="statusOptions"
            label="Status"
            dense
            outlined
            class="task-status-dropdown"
          />
        </q-item-section>
        <q-item-label caption class="task-description">{{ task.description }}</q-item-label>
        <q-linear-progress
          :value="task.progress"
          :color="getProgressColor(task.progress)"
          track-color="grey-3"
          class="task-progress"
        />
        <q-item-label caption class="task-deadline">Due: {{ task.deadline }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from 'vue'

// Dummy data for tasks
const tasks = ref([
  {
    taskID: '1',
    subject: 'Complete Assignment',
    description: 'Finish the math assignment on calculus.',
    progress: 0.5,
    deadline: '2025-05-01',
    status: 'Pending',
  },
  {
    taskID: '2',
    subject: 'Prepare Presentation',
    description: 'Create slides for the science project presentation.',
    progress: 0.7,
    deadline: '2025-05-03',
    status: 'In Progress',
  },
  {
    taskID: '3',
    subject: 'Submit Report',
    description: 'Submit the final report for the history project.',
    progress: 1.0,
    deadline: '2025-05-05',
    status: 'Completed',
  },
  {
    taskID: '4',
    subject: 'Read Chapter 5',
    description: 'Read chapter 5 of the history textbook and take notes.',
    progress: 0.2,
    deadline: '2025-05-08',
    status: 'Pending',
  },
  {
    taskID: '5',
    subject: 'Code Functionality',
    description: 'Implement the user authentication functionality.',
    progress: 0.9,
    deadline: '2025-05-10',
    status: 'In Progress',
  },
  {
    taskID: '6',
    subject: 'Review Draft',
    description: 'Review the first draft of the research paper.',
    progress: 0.6,
    deadline: '2025-05-12',
    status: 'In Progress',
  },
  {
    taskID: '7',
    subject: 'Attend Meeting',
    description: 'Attend the team meeting at 2 PM.',
    progress: 1.0,
    deadline: '2025-05-02',
    status: 'Completed',
  },
])

const statusOptions = ['Pending', 'In Progress', 'Completed']

const handleMouseenter = () => {}
const handleMouseleave = () => {}

const getProgressColor = (progress) => {
  if (progress < 0.33) return 'red'
  if (progress < 0.66) return 'orange'
  return 'green'
}
</script>

<style lang="scss" scoped>
.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 16px;
}

.task-card {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative; /* Needed for proper positioning of potential children */
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer; /* Indicate it's interactive */
}

.task-status-bar {
  width: 5px;
  height: 100%;
  border-radius: 8px; /* No rounded edges for a clean vertical line */
}

.task-status-bar.pending {
  background: linear-gradient(180deg, #f0ad4e, #f7c46c); /* Gradient for Pending */
}

.task-status-bar.in-progress {
  background: linear-gradient(180deg, #5bc0de, #7cd3f0); /* Gradient for In Progress */
}

.task-status-bar.completed {
  background: linear-gradient(180deg, #5cb85c, #7ed87e); /* Gradient for Completed */
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.task-status-dropdown {
  margin-bottom: 8px;
}

.task-description {
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
}

.task-progress {
  margin: 8px 0;
}

.task-deadline {
  font-size: 12px;
  color: #999;
}
</style>
