<template>
  <div class="map">
    <div v-for="(block_row, i) in gameMap" class="map-rows">
      <Block
        :color="BLOCK_COLORS[block_col as keyof typeof BLOCK_COLORS]"
        v-for="(block_col, j) in block_row"
        :class="`map-${j}-${i} map-cols`"
      />
    </div>
    <Plane :position="plane_pos" />
  </div>
</template>
<script setup lang="ts">
import Block from './Block.vue'
import Plane from '@/components/sprites/Plane.vue'
const block_rows = Array(5)
const block_cols = Array(10)
const plane_pos = { x: 1, y: 2 }
const BLOCK_COLORS = {
  0: '#6aa84f',
  1: '#d70909',
  2: '#1369b7'
}
const gameMap = [
  [3, 3, 3, 3, 3],
  [3, 0, 0, 1, 3],
  [3, 0, 3, 2, 3],
  [3, 3, 3, 3, 3]
]
</script>
<style scoped>
.map-rows {
  display: flex;
  gap: 3px;
}
.map {
  position: relative;
  margin-top: 2rem;
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
