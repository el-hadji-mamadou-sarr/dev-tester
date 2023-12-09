<script setup lang="ts">
import Map from '@/components/map/Map.vue'
import TurnRight from '@/components/sprites/TurnRight.vue'
import Move from '@/components/sprites/Move.vue'
import TurnLeft from '@/components/sprites/TurnLeft.vue'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import Level from '@/utils/ILevel'

const plane_elt = ref()
const plane_head = ref(180)
const run = ref(false)
const instructions_stack = ref<number[]>([])
const innitial_plane_pos = ref()
const level_data = ref()
const objectives = ref()

onBeforeMount(async () => {
  level_data.value = await load_level()
})

onMounted(async () => {
  plane_elt.value = document.querySelector('.plane')
  plane_elt.value.style.transform = 'rotate(180deg)'
  plane_head.value = 0
  innitial_plane_pos.value = {
    x: parseFloat(plane_elt.value.style.left) || 0,
    y: parseFloat(plane_elt.value.style.top) || 0
  }
  objectives.value = level_data.value.objectives.length
  console.log(objectives.value)
})

const check_get_objective = () => {
  const currentTop = parseFloat(plane_elt.value.style.top) / 43 || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) / 43 || 0
  //objectives: { x: 6, y: 1 }
  level_data.value.objectives.forEach((objective, i) => {
    if (objective.x == currentLeft && objective.y == currentTop) {
      level_data.value.objectives.splice(i, 1)
      objectives.value = level_data.value.objectives.length
      document.querySelector(`.objective-${i}`)?.remove()
    }
  })
}

watch(objectives, (newVal, oldVal) => {
  // console.log(newVal, oldVal)
  if (newVal == 0) {
    console.log('you win')
    run.value = false
  }
})

const load_level = async () => {
  const res = await fetch('../../levels.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  const levels = (await res.json()) as Level[]
  return levels[0]
}
const move_plane = () => {
  const currentTop = parseFloat(plane_elt.value.style.top) || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) || 0

  switch (plane_head.value) {
    case 0:
      plane_elt.value.style.left = currentLeft + 43 + 'px'
      break

    case -180 || 180:
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

const selected_box = ref(NaN)
const selected_box_elt = ref()

const select_box = (i: number) => {
  if (selected_box_elt.value) {
    selected_box_elt.value.style.backgroundColor = 'white'
  }
  selected_box.value = i
  selected_box_elt.value = document.querySelector(`.fo-item-${i}`) as HTMLElement
  if (selected_box_elt.value) {
    selected_box_elt.value.style.backgroundColor = 'grey'
  }
}
const reset_plane_position = () => {
  plane_elt.value.style.transform = 'rotate(180deg)'
  plane_head.value = 0
  plane_elt.value.style.top = innitial_plane_pos.value.y + 'px'
  plane_elt.value.style.left = innitial_plane_pos.value.x + 'px'
  instructions_stack.value = []
}

// its to prevent the stack from being empty
const update_instructions_stack = () => {
  if (instructions_stack.value.length > 32) return
  for (let i = 0; i <= Math.abs(32 - instructions_stack.value.length); i++) {
    if (Number.isNaN(f0.value[i])) {
      continue
    }
    if (f0.value[i] != 'f0') {
      instructions_stack.value.push(Number(f0.value[i]))
    } else {
      update_instructions_stack()
    }
  }
  if (instructions_stack.value.length == 0) {
    update_instructions_stack()
  }
}

const SPEED = 500
// to delete the first element of the stack
const shift_instructions_stack = () => {
  setTimeout(() => {
    instructions_stack.value.shift()
  }, SPEED / 3)
}
// f0 is the the list of instructions
const f0 = ref<(number | string)[]>([NaN, NaN, NaN, NaN])
const run_f1 = () => {}
// the function that runs the instructions in f0
const run_fo = async () => {
  if (!run.value) {
    reset_plane_position()
    update_instructions_stack()
    run.value = true
  }

  for (let index = 0; index < f0.value.length; index++) {
    const val = f0.value[index]
    if (!run.value) return
    switch (val) {
      case 0:
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            turn_right()

            if (!check_hit_wall()) {
              return
            }
            resolve()
          }, index * SPEED)
        )
        shift_instructions_stack()
        break
      case 1:
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            turn_left()

            if (!check_hit_wall()) {
              return
            }

            resolve()
          }, index * SPEED)
        )
        shift_instructions_stack()
        break
      case 2:
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            move_plane()
            check_get_objective()
            if (!check_hit_wall()) {
              return
            }

            resolve()
          }, index * SPEED)
        )
        shift_instructions_stack()
        break
      case 'f0':
        await new Promise((resolve) =>
          setTimeout(() => {
            update_instructions_stack()
            run_fo().then(resolve)
          }, index * SPEED)
        )
        break

      // case 'f1':
      //   await new Promise((resolve) =>
      //     setTimeout(() => {
      //       run_f1().then(resolve)
      //     }, index * SPEED)
      //   )
      //   break
    }

    if (index === f0.value.length - 1 && val !== 'f0') {
      run.value = false
    }
  }
}

// check if the plane hit the wall
const check_hit_wall = () => {
  const currentTop = parseFloat(plane_elt.value.style.top) || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) || 0
  const current_box = document.querySelector(`.map-${currentLeft / 43}-${currentTop / 43}`)
    ?.children[0] as HTMLElement
  if (current_box.getAttribute('fill') == '#D9D9D9') {
    run.value = false
    return false
  } else {
    return true
  }
}
// to reset the selected box
const reset_selected_box = () => {
  selected_box.value = NaN
  selected_box_elt.value.style.backgroundColor = 'white'
}

const select_move = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value] = 2
  reset_selected_box()
}
const select_turn_right = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value] = 0
  reset_selected_box()
}
const select_turn_left = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value] = 1
  reset_selected_box()
}
const select_f0 = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value] = 'f0'
  reset_selected_box()
}
</script>
<template>
  <main>
    <Map :level_data="level_data" />

    <button @click="run_fo" :disabled="run">run Fo</button>
    <div class="instructions-list">
      <!-- <div class="current-instruction">
        <TurnRight v-if="instructions_stack[0] == 0" />
        <TurnLeft v-if="instructions_stack[0] == 1" />
        <Move v-if="instructions_stack[0] == 2" />
      </div> -->
      <div
        :class="`next-instructions instruction-${i}`"
        v-for="(instruction, i) in instructions_stack.slice(0, 10)"
      >
        <TurnRight v-if="instruction == 0" />
        <TurnLeft v-if="instruction == 1" />
        <Move v-if="instruction == 2" />
      </div>
      <div class="instruction-0" v-if="instructions_stack.length == 0"></div>
    </div>
    <div class="selections">
      <button><TurnRight @click="select_turn_right" /></button>
      <button><TurnLeft @click="select_turn_left" /></button>
      <button><Move @click="select_move" /></button>
      <button class="f0-selections" @click="select_f0">
        <span class="fo-span">f0</span>
      </button>
    </div>
    <div class="fo">
      <span class="fo-span">f0 =</span>
      <div v-for="(item, i) in f0">
        <div key="i" :class="`fo-item fo-item-${i}`" @click="select_box(i)">
          <TurnRight v-if="item == 0" />
          <TurnLeft v-if="item == 1" />
          <Move v-if="item == 2" />
          <span class="fo-span" v-if="item == 'f0'">f0</span>
          <span class="fo-span" v-if="item == 'f1'">f1</span>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.next-instructions {
  width: 40px;
  height: 40px;
  border: 2px solid black;
}
.instructions-list {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}
.instruction-0 {
  width: 40px;
  height: 40px;
  border: none;
  border-bottom: 5px solid black;
}
.f0-selections {
  width: 56px;
  height: 49px;
}
.selections {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}
.fo-span {
  font-size: 32px;
  font-weight: bold;
}
.fo-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-width: 2px;
  border-style: dotted;
}

.fo {
  display: flex;

  justify-content: start;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}
</style>