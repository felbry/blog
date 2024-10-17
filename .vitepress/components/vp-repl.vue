<template>
  <sl-drawer
    label="Playground"
    placement="bottom"
    :open="isOpen"
    @sl-request-close="onRequestClose"
    @sl-hide="onHide"
    style="--size: 100vh; color: black"
  >
    This drawer slides in from the bottom.
    <div slot="header-actions">dhfkfgkskfhkjdshk</div>
  </sl-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.17.1/cdn/components/drawer/drawer.js'

const emits = defineEmits(['hide'])
const isOpen = ref(true)
function open() {
  isOpen.value = true
}
function onRequestClose(event) {
  // event.detail.source 'close-button' | 'keyboard' | 'overlay'
  if (['keyboard', 'overlay'].includes(event.detail.source)) event.preventDefault()
}
function onHide() {
  isOpen.value = false
  emits('hide')
}

defineExpose({
  open,
})
</script>
<style>
/* @import url(./shoelace-light@2.17.1.css); */
</style>
