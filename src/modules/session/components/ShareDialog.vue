<template>
  <!-- share popup -->
  <q-dialog v-model="showShare">
    <q-card style="border-radius: 12px; width: 400px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-primary text-center q-mb-md">Share Session Join Link</div>

        <div>
          <p class="text-grey-8 q-mb-md">Share this group with others using the link below:</p>
          <q-input
            v-model="shareLink"
            readonly
            outlined
            type="textarea"
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
        </div>
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
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Notify } from 'quasar'

const props = defineProps({
  showSharePopup: Boolean,
  link: String,
})
const showShare = ref()
const shareLink = ref()

onMounted(() => {
  shareLink.value = props.link
  showShare.value = props.showSharePopup
})

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value).then(() => {
    Notify.create({
      message: 'Link copied to clipboard',
      color: 'positive',
      position: 'top',
      timeout: 1000,
    })
  })
}
</script>

<style lang="scss" scoped></style>
