import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  pinia.use(piniaPersist) // ✅ Register persistence plugin

  return pinia
})

export * from './liveShare-store'
