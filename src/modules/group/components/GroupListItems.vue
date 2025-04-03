<template>
  <div class="container">
    <q-item clickable v-ripple>
      <q-item-section>
        <q-item-label>{{ group.groupName }}</q-item-label>
        <div class="row">
          <div class="">Subject: {{ group.subjectName }}</div>
          <div class="col text-right text-dark">
            <span class="">&nbsp;{{ group.semester }}</span>
            <span>&nbsp;||&nbsp;{{ group.year }} </span>
            <span v-if="group.labGroup" class="text-bold text-primary"
              >&nbsp;<span class="text-black">||</span>&nbsp;Lab Group</span
            >
          </div>
        </div>
      </q-item-section>
    </q-item>
    <q-btn flat dense size="sm" color="secondary" icon="share" @click="showSharePopup = true" />

    <q-dialog v-model="showSharePopup">
      <q-card style="border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 text-primary text-center q-mb-md">Share Group</div>
          <p class="text-grey-8 text-center q-mb-md">
            Share this group with others using the link below:
          </p>
          <q-input
            v-model="shareLink"
            readonly
            outlined
            dense
            input-class="text-grey-9"
            color="primary"
            style="border-radius: 8px"
          >
            <template v-slot:append>
              <q-btn
                flat
                icon="content_copy"
                @click="copyLink"
                color="primary"
                style="border-radius: 50%"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md">
          <q-btn
            flat
            label="Close"
            v-close-popup
            color="grey-8"
            style="border-radius: 8px; padding: 10px 16px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'

const props = defineProps({
  group: Object,
})

const baseUrl = ref()

const showSharePopup = ref(false)
const shareLink = ref()

onMounted(() => {
  baseUrl.value = window.location.origin

  if (props.group && props.group.id) {
    shareLink.value = `${baseUrl.value}/group/join/${props.group.id}`
  } else {
    console.error('Group ID is missing.')
    shareLink.value = 'invalid link'
  }
})

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
  // Optionally, show a notification that the link has been copied
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.q-item {
  width: 800px;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-item:hover {
  background-color: #f5f5f5;
}
</style>
