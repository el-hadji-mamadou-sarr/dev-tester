<template>
  <div class="map">
    <div v-for="(block_row, i) in level_data.gameMap" class="map-rows">
      <Block
        :color="BLOCK_COLORS[block_col as keyof typeof BLOCK_COLORS]"
        v-for="(block_col, j) in block_row"
        :class="`map-${j}-${i} map-cols`"
      />
    </div>
    <Plane :position="level_data.plane_pos" />
    <Objective v-for="(object_pos, i) in level_data.objectives" :position="object_pos" :index="i" />
  </div>
</template>
<script setup lang="ts">
import Block from './Block.vue'
import Plane from '@/components/sprites/Plane.vue'
import { onMounted, ref } from 'vue'
import Objective from '../sprites/Objective.vue'
import { default_level_map } from '@/utils/constantes'
const props = defineProps({
  level_data: {
    type: Object,
    default: default_level_map
  },
  loading: { type: Boolean }
})

const BLOCK_COLORS = {
  0: '#6aa84f',
  1: '#d70909',
  2: '#1369b7'
}
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
