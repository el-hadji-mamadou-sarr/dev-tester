<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: '#D9D9D9'
  }
})
</script>
<template>
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" :fill="color" />
  </svg>
</template>
