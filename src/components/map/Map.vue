<template>
  <div class="map">
    <div v-for="block_row in block_rows" class="map-rows">
      <Block v-for="block_col in block_cols" :class="`map-cols-${block_col} map-cols`" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Block from './Block.vue'
const block_rows = Array(5)
const block_cols = Array(10)
</script>
<style scoped>
.map-rows {
  display: flex;
  gap: 3px;
}
.map {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
