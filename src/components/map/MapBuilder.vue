<script setup lang="ts">
import { onMounted, ref } from 'vue'
//colors: blue, green, red
const BLOCK_COLORS = {
  0: '#D9D9D9',
  1: '#D9D9D9',
  2: '#D9D9D9'
}
// x is a wall
const gameMap = [
  ['x', 'x', 'x', 'x', 'x'],
  ['x', 0, 0, 1, 'x'],
  ['x', 0, 'x', 2, 'x'],
  ['x', 'x', 'x', 'x', 'x']
]
</script>
<template>
    
</template>
