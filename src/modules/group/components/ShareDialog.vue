<template>
  <q-dialog v-model="showSharePopup" transition-show="fade" transition-hide="fade">
    <q-card style="border-radius: 12px; width: 400px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-primary text-center q-mb-md">Share Group</div>
        <q-toggle
          v-model="shareWithPassword"
          v-if="isOwner"
          label="Share with Password"
          class="q-mb-md"
        />

        <div v-if="shareWithPassword">
          <div class="h6 text-grey-8 q-mb-md">Share with Group Link and Password</div>
          <span>"Let's confirm it's really you."</span>
          <q-input
            v-model="passwordInput"
            label="User Password"
            outlined
            dense
            type="password"
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
          />

          <q-btn
            @click="generateShareText(group?.password)"
            label="Generate Share Text"
            color="primary"
            class="full-width q-mb-md"
            style="border-radius: 8px"
            :disable="isDisible"
          />

          <div v-if="shareText">
            <q-input
              v-model="shareText"
              readonly
              outlined
              dense
              type="textarea"
              input-class="text-grey-9"
              color="primary"
              style="border-radius: 8px"
            >
              <template v-slot:append>
                <q-btn flat icon="content_copy" @click="copyShareText" color="primary" />
              </template>
            </q-input>
          </div>
        </div>

        <div v-else>
          <p class="text-grey-8 q-mb-md">Share this group with others using the link below:</p>
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
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { useUserStore } from 'src/stores/user-store'
import { ref, defineProps, onMounted } from 'vue'
const userStore = useUserStore()

const authStore = useAuthStore()

const props = defineProps({
  sharePopup: { type: Boolean, required: true },
  group: {
    type: Object,
  },
})

const showSharePopup = ref(props.sharePopup)

const baseUrl = ref()

const shareLink = ref()

const shareWithPassword = ref(false)
const passwordInput = ref('')
const shareText = ref('')
const isOwner = ref()
onMounted(() => {
  console.log(userStore.currentUser.id)
  if (props.group.owner.id === userStore.currentUser.id) {
    isOwner.value = true
  } else {
    isOwner.value = false
  }

  baseUrl.value = window.location.origin

  if (props.group?.id) {
    shareLink.value = `${baseUrl.value}/group/join/${props.group.id}`
  } else {
    shareLink.value = 'invalid link'
  }
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

const copyShareText = () => {
  navigator.clipboard.writeText(shareText.value).then(() => {
    Notify.create({
      message: 'Share text copied to clipboard',
      color: 'positive',
      position: 'top',
      timeout: 1000,
    })
  })
}

const isDisible = ref(false)
const generateShareText = async (password) => {
  await authStore.verifyUserPassword(passwordInput.value).then((result) => {
    if (result.success) {
      shareText.value = [
        `Join ${props.group.groupName} group using this link:`,
        shareLink.value,
        passwordInput.value ? `\nPassword: ${password}` : '',
      ].join('\n')
      isDisible.value = true
    } else {
      Notify.create({
        message: result.message,
        color: 'negative',
        position: 'top',
        timeout: 1000,
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
