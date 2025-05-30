<!--
CourseDetailCard.vue

Usage Example:

<CourseDetailCard
  :title="course.name"
  :code="course.code"
  :avatar-message="course.code"
  :show-avatar="true"
  :show-code="true"
  :show-back-button="true"
  go-back-url="/admin/faculty"
  :items="[
    { label: 'Head of Course', value: course.headOfFaculty, icon: 'person' },
    { label: 'Email', value: course.email, icon: 'email', link: 'mailto:' + course.email },
    { label: 'Phone', value: course.phone, icon: 'phone' },
    { label: 'Office', value: course.officeLocation, icon: 'location_on' },
    { label: 'Website', value: course.website, icon: 'public', link: course.website },
    { label: 'Description', value: course.description, icon: 'description' }
  ]"
/>

Props:
- title (String): Title or main heading (e.g. course name).
- code (String): Optional subtitle/code shown under title.
- avatarMessage (String): Text shown inside the avatar.
- showAvatar (Boolean): Whether to show the avatar.
- showCode (Boolean): Whether to display the course code.
- showBackButton (Boolean): Whether to show the top-left back button.
- backUrl (String): Route to navigate when back button is clicked.
- items (Array): Array of objects representing detail items:
    - label: String (e.g. "Email")
    - value: String (e.g. "admin@example.com")
    - icon: String (e.g. "email")
    - link: (Optional) String (e.g. "mailto:admin@example.com")

Notes:
- If `link` is provided, the value is rendered as a clickable Quasar button.
- Icons should be valid Quasar Material Icons.
-->

<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <q-card
      class="modern-faculty-card q-pa-xl q-mt-xl q-mb-xl shadow-10"
      style="max-width: 520px; width: 100%; border-radius: 24px"
    >
      <q-card-section class="row items-center q-gutter-md q-pb-none">
        <div
          v-if="showAvatar"
          class="q-mr-md text-white text-weight-bold shadow-4"
          style="
            background-color: var(--q-primary);
            border-radius: 16px;
            width: auto;
            height: auto;
            min-width: 72px;
            min-height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            aspect-ratio: 1 / 1;
            font-size: 1.25rem;
          "
        >
          {{ avatarMessage || '?' }}
        </div>

        <div>
          <div class="text-h5 text-weight-bold text-primary">{{ title }}</div>
          <div v-if="showCode" class="text-subtitle2 text-grey-7 q-mt-xs">
            Code: <span class="text-weight-medium">{{ code }}</span>
          </div>
        </div>
      </q-card-section>

      <q-separator spaced color="grey-3" />

      <q-card-section class="q-gutter-md q-pt-none q-mt-md">
        <q-item v-for="(item, index) in items" :key="index" dense class="q-pa-none">
          <q-item-section avatar>
            <q-icon :name="item.icon" color="secondary" size="md" />
          </q-item-section>
          <q-item-section>
            <span class="text-weight-medium">{{ item.label }}</span>
            <div class="text-grey-8">
              <q-btn
                v-if="item.link"
                flat
                dense
                no-caps
                color="primary"
                class="q-ml-xs q-pl-none"
                style="justify-content: flex-start; width: fit-content"
                :label="item.value"
                :href="item.link"
                target="_blank"
              />
              <span v-else>{{ item.value }}</span>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions v-if="showBackButton" class="q-pa-none" align="right">
        <q-btn
          flat
          color="grey"
          icon="arrow_back"
          unelevated
          label="Back"
          size="sm"
          class="q-px-md q-py-xs rounded-borders text-weight-medium"
          @click="goBack"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: String,
  code: String,
  avatarMessage: String,
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showCode: {
    type: Boolean,
    default: true,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
  backUrl: {
    type: String,
    default: '/admin',
  },
  items: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()

function goBack() {
  router.push(props.backUrl)
}
</script>

<style scoped>
.modern-faculty-card {
  background: linear-gradient(135deg, #f8fafd 0%, #e3f0ff 100%);
  box-shadow: 0 8px 32px 0 rgba(60, 80, 180, 0.1);
  border: 1.5px solid #e3eaf7;
}
</style>
