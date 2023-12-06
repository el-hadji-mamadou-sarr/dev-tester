<script setup lang="ts">
import Map from '@/components/map/Map.vue'

import { onMounted, ref } from 'vue'

const plane_elt = ref()
const plane_head = ref(180)
onMounted(() => {
  plane_elt.value = document.querySelector('.plane')
  plane_elt.value.style.transform = 'rotate(180deg)'
  plane_head.value = 0
})

const move_plane = () => {
  const currentTop = parseFloat(plane_elt.value.style.top) || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) || 0

  switch (plane_head.value) {
    case 0:
      plane_elt.value.style.left = currentLeft + 43 + 'px'
      break

    case 180:
      plane_elt.value.style.left = currentLeft - 43 + 'px'
      break

    case 90:
      plane_elt.value.style.top = currentTop + 43 + 'px'
      break
    case -90:
      plane_elt.value.style.top = currentTop - 43 + 'px'
      break
  }
}

const turn_left = () => {
  const currentDirection = plane_elt.value.style.transform
  plane_elt.value.style.transform = currentDirection + 'rotate(-90deg)'
  plane_head.value = plane_head.value - 90
  if (plane_head.value == -270) {
    plane_head.value = 90
  }
}

const turn_right = () => {
  const currentDirection = plane_elt.value.style.transform
  plane_elt.value.style.transform = currentDirection + 'rotate(90deg)'
  plane_head.value = plane_head.value + 90
  if (plane_head.value == 270) {
    plane_head.value = -90
  }
}
const options = {
  tr: 0,
  tl: 1,
  m: 3
}

const Fo = [3, 3, 1, 0, 3, 1]
const run_fo = () => {
  Fo.map((val, index) => {
    switch (val) {
      case 0:
        setTimeout(() => turn_right(), index * 1000)
        break
      case 1:
        setTimeout(() => turn_left(), index * 1000)
        break
      case 3:
        setTimeout(() => move_plane(), index * 1000)
        break
    }
  })
}

</script>
<template>
  <main>
    <Map />
    <button @click="move_plane">move plane</button>
    <button @click="turn_right">turn right</button>
    <button @click="turn_left">turn left</button>
    <button @click="run_fo">run Fo</button>
    <div>
      
    </div>
  </main>
</template>
