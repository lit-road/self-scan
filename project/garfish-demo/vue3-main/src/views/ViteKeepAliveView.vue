<template>
  <div ref="container"></div>
</template>

<script lang="ts">
export default {
  name: 'ViteKeepAliveView'
}
</script>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import Garfish, { type interfaces } from 'garfish'

const container = ref<HTMLElement | null>(null)

const { apps } = storeToRefs(useAppStore())

const appInfo = computed(() => {
  const app = apps.value.find((item) => item.name === 'viteApp')
  if (app) {
    return {
      ...app,
      name: app.name + 'KeepAlive'
    }
  }
})

let app: interfaces.App | null = null

onMounted(async () => {
  if (appInfo.value) {
    const { name, entry, activeWhen } = appInfo.value
    app = await Garfish.loadApp(name, {
      entry,
      domGetter: () => container.value!,
      basename: activeWhen,
      props: {
        path: '/tab-view'
      },
      sandbox: false
    })
    await app?.mount()
  }
})

onUnmounted(() => {
  app?.unmount()
  app = null
})
</script>

<style lang="less" scoped></style>
