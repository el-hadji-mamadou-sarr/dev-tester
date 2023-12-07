<template>
  <div class="plane" :style="{ top: position.y * 43 + 'px', left: position.x * 43 + 'px' }">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 -1.07288e-06H18L10.5 12.6316H2.25C1.005 12.6316 0 13.6895 0 15C0 16.3105 1.005 17.3684 2.25 17.3684H10.5L18 30H21L17.25 17.3684H25.5L27.75 20.5263H30L28.5 15L30 9.47368L27.75 9.47368L25.5 12.6316H17.25L21 -1.07288e-06Z"
        fill="black"
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  position: {
    type: Object,
    default: { x: 0, y: 0 }
  }
})
</script>
<style scoped>
.plane {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
</style>
