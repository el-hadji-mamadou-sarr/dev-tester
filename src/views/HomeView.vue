<script setup lang="ts">
import Map from '@/components/map/Map.vue'
import Plane from '@/components/sprites/Plane.vue'
import { onMounted, ref } from 'vue'

const plane_elt = ref()

onMounted(() => {
  plane_elt.value = document.querySelector('.plane')
})

const move_plane = () => {
  const currentLeft = parseFloat(plane_elt.value.style.left) || 0
  plane_elt.value.style.left = currentLeft + 43 + 'px'
}
</script>
<template>
  <main>
    <Plane />
    <Map />
    <button @click="move_plane">move plane</button>
  </main>
</template>
