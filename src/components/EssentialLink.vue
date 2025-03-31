<template>
  <div class="q-pa-sm" style="max-width: 350px">
    <q-list class="rounded-borders">
      <q-expansion-item
        v-if="props.subMenu.length"
        :icon="props.icon"
        :label="props.title"
        class="text-secondary text-body1 text-bold"
      >
        <q-list style="min-width: 200px">
          <q-item
            v-for="subItem in props.subMenu"
            :key="subItem.link"
            clickable
            tag="a"
            @click="router.push(subItem.link)"
          >
            <q-item-section v-if="subItem.icon" avatar class="q-pl-sm">
              <q-icon :name="subItem.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ subItem.title }}</q-item-label>
              <q-item-label caption>{{ subItem.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <q-item clickable v-ripple v-else @click="router.push(props.link)">
        <q-item-section avatar>
          <q-icon color="secondary" :name="props.icon" />
        </q-item-section>

        <q-item-section class="text-secondary text-bold text-body1">{{
          props.title
        }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  link: String,
  icon: String,
  title: String,
  caption: String,
  subMenu: {
    type: Array,
    default: () => [],
  },
})
</script>
<style scoped>
.q-expansion-item :deep(.q-icon) {
  color: #134f7b;
}
</style>
