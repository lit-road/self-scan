<template>
  <wujie-vue :name="appInfo.name" :url="appInfo.url" :alive="true" />
</template>

<script lang="ts">
export default {
  name: 'ViteKeepAliveView'
}
</script>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import WujieVue from 'wujie-vue3'
import { computed } from 'vue'

const { apps } = storeToRefs(useAppStore())

const appInfo = computed(() => {
  const app = apps.value.find((item) => item.name === 'viteApp')!
  return {
    ...app,
    name: app.name + 'KeepAlive',
    url: app.url + '#/viteApp/tab-view'
  }
})
</script>

<style lang="less" scoped></style>
