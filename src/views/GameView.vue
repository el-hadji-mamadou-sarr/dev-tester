<script setup lang="ts">
import Map from '@/components/map/Map.vue'
import TurnRight from '@/components/sprites/TurnRight.vue'
import Move from '@/components/sprites/Move.vue'
import TurnLeft from '@/components/sprites/TurnLeft.vue'
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import Level from '@/utils/ILevel'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import StopIcon from '@/components/icons/StopIcon.vue'
import { BLOCK_COLORS } from '@/utils/constantes'
import { useUserScore } from '../stores/score'
import { onBeforeRouteUpdate, routerKey, useRoute, useRouter } from 'vue-router'
import Win from '@/components/Win.vue'
import ResetIcon from '@/components/icons/ResetIcon.vue'
const plane_elt = ref()
const plane_head = ref(180)
const run = ref(false)
const instructions_stack = ref<number[]>([])
const innitial_plane_pos = ref()
const level_data = ref()
const objectives = reactive([] as { x: number; y: number }[])
const loading = ref(true)
const memo_box_color = ref()
const store = useUserScore()
const route = useRoute()
const router = useRouter()
const level = ref(0)
// f0 is the the list of instructions
const f0 = ref<(number | string)[][]>([
  [NaN, NaN],
  [NaN, NaN],
  [NaN, NaN],
  [NaN, NaN],
  [NaN, NaN]
])

const reset_f0 = () => {
  for (let i = 0; i < f0.value.length; i++) {
    const f0ItemsElement = document.querySelector(`.fo-item-${i}`) as HTMLElement
    f0ItemsElement.style.backgroundColor = 'white'
  }
  f0.value = [
    [NaN, NaN],
    [NaN, NaN],
    [NaN, NaN],
    [NaN, NaN],
    [NaN, NaN]
  ]
}
onBeforeMount(() => {
  level.value = parseFloat(route.params.levelID as unknown as string)
  if (store.score !== level.value) {
    router.push({ path: `/level/${store.score}` })
    level.value = store.score
  }
  load_level()
})

const set_plane_direction = () => {
  switch (level_data.value.plane_direction) {
    case 'right':
      plane_head.value = 0
      plane_elt.value.style.transform = 'rotate(180deg)'
      break
    case 'left':
      plane_head.value = 180
      break
    case 'up':
      plane_head.value = -90
      plane_elt.value.style.transform = 'rotate(90deg)'
      break
    case 'down':
      plane_head.value = 90
      plane_elt.value.style.transform = 'rotate(-90deg)'
      break
  }
}

const load_game = () => {
  plane_elt.value = document.querySelector('.plane')
  level_data.value.objectives.map((objective: { x: number; y: number }, i: number) => {
    const objective_elt = document.querySelector(`.objective-${i}`) as HTMLElement
    if (objective_elt) {
      objective_elt.style.removeProperty('display')
    }
  })

  if (plane_elt.value) {
    set_plane_direction()
    innitial_plane_pos.value = {
      x: level_data.value.plane_pos.x * 43,
      y: level_data.value.plane_pos.y * 43
    }
  } else {
    console.warn('Could not find .plane element.')
  }
}
const reset_objectives = () => {
  objectives.splice(0, objectives.length)
  level_data.value.objectives.map((objective: { x: number; y: number }, i: number) => {
    objectives.push(objective)
    const objective_elt = document.querySelector(`.objective-${i}`) as HTMLElement
    if (objective_elt) {
      objective_elt.style.removeProperty('display')
    }
  })
}
const win = ref(false)
watch(loading, (val) => {
  if (!val) {
    load_game()
  }
})
watch(objectives, (newVal, oldVal) => {
  if (newVal.length == 0) {
    if (store.score == 10) {
      win.value = true
    } else {
      store.level_up()
      run.value = false
      router.push({ path: `/level/${store.score}` })
      level.value = store.score
      loading.value = true
      load_level()
      reset_f0()
      reset_plane_position()
    }
  }
})
const load_level = async () => {
  try {
    const res = await fetch('../../levels.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    const levels = (await res.json()) as Level[]
    level_data.value = levels[level.value]
    level_data.value.objectives.map((objective: { x: number; y: number }) => {
      objectives.push(objective)
    })
  } catch (error) {
    console.error('Error loading level:', error)
  } finally {
    loading.value = false
  }
}

const check_get_objective = () => {
  const currentTop = parseFloat(plane_elt.value.style.top) / 43 || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) / 43 || 0
  //objectives: { x: 6, y: 1 }
  for (let i = 0; i < objectives.length; i++) {
    const objt = objectives[i]
    if (objt.x == currentLeft && objt.y == currentTop) {
      console.log('bofore', objectives.length)
      console.log('bofore i ', i)

      objectives.splice(i, 1)
      console.log('after', objectives.length)
      const objectiveElement = document.querySelector(`.objective-${i}`) as HTMLElement
      objectiveElement.style.display = 'none'
      return
    }
  }
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
  if (selected_box_elt.value?.style.backgroundColor == 'grey') {
    selected_box_elt.value.style.backgroundColor = memo_box_color.value
  }
  selected_box.value = i
  selected_box_elt.value = document.querySelector(`.fo-item-${i}`) as HTMLElement
  if (selected_box_elt.value) {
    memo_box_color.value = selected_box_elt.value.style.backgroundColor
    selected_box_elt.value.style.backgroundColor = 'grey'
  }
}
const reset_plane_position = () => {
  set_plane_direction()
  plane_elt.value.style.top = innitial_plane_pos.value.y + 'px'
  plane_elt.value.style.left = innitial_plane_pos.value.x + 'px'
  instructions_stack.value = []
}

// its to prevent the stack from being empty
const update_instructions_stack = () => {
  if (instructions_stack.value.length > 32) return
  for (let i = 0; i <= Math.abs(32 - instructions_stack.value.length); i++) {
    if (i >= f0.value.length) return
    if (Number.isNaN(f0.value[i][0])) {
      continue
    }
    if (f0.value[i][0] != 'f0') {
      instructions_stack.value.push(Number(f0.value[i][0]))
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

const run_f1 = () => {}
const run_game = () => {
  reset_objectives()
  reset_plane_position()
  update_instructions_stack()
  run.value = true
  setTimeout(() => {
    run_fo()
  }, 500)
}

const check_color_condition = (color_cond: number) => {
  const currentTop = parseFloat(plane_elt.value.style.top) || 0
  const currentLeft = parseFloat(plane_elt.value.style.left) || 0
  const current_box = document.querySelector(`.map-${currentLeft / 43}-${currentTop / 43}`)
    ?.children[0] as HTMLElement
  const current_box_color = current_box.getAttribute('fill')
  if (Number.isNaN(color_cond)) return true
  if (current_box_color == BLOCK_COLORS[color_cond as keyof typeof BLOCK_COLORS]) {
    return true
  } else {
    return false
  }
}
// the function that runs the instructions in f0
const run_fo = async () => {
  for (let index = 0; index < f0.value.length; index++) {
    const val = f0.value[index][0]
    if (!run.value) return
    if (!check_color_condition(f0.value[index][1] as number)) continue
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
  // selected_box_elt.value.style.backgroundColor = 'white'
}

const select_move = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][0] = 2
  if ((f0.value[selected_box.value][1] as number) >= 0) {
    selected_box_elt.value.style.backgroundColor =
      BLOCK_COLORS[f0.value[selected_box.value][1] as keyof typeof BLOCK_COLORS]
  }
  reset_selected_box()
}
const select_turn_right = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][0] = 0
  if ((f0.value[selected_box.value][1] as number) >= 0) {
    selected_box_elt.value.style.backgroundColor =
      BLOCK_COLORS[f0.value[selected_box.value][1] as keyof typeof BLOCK_COLORS]
  }
  reset_selected_box()
}
const select_turn_left = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][0] = 1
  if ((f0.value[selected_box.value][1] as number) >= 0) {
    selected_box_elt.value.style.backgroundColor =
      BLOCK_COLORS[f0.value[selected_box.value][1] as keyof typeof BLOCK_COLORS]
  }
  reset_selected_box()
}
const select_f0 = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][0] = 'f0'
  if ((f0.value[selected_box.value][1] as number) >= 0) {
    selected_box_elt.value.style.backgroundColor =
      BLOCK_COLORS[f0.value[selected_box.value][1] as keyof typeof BLOCK_COLORS]
  }
  reset_selected_box()
}

const stop_game = () => {
  run.value = false
}

const select_green = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][1] = 0
}
const select_blue = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][1] = 1
}
const select_red = () => {
  if (isNaN(selected_box.value)) return
  f0.value[selected_box.value][1] = 2
}
</script>
<template>
  <Win v-if="win" />
  <main v-if="!win">
    <h1 class="level">Level: {{ store.score }}</h1>
    <Map :loading="loading" :level_data="level_data" />
    <div class="btns">
      <button class="btn play-btn" @click="run_game" :disabled="run">
        <PlayIcon :disabled="run" />
      </button>
      <button class="btn stop-btn" @click="stop_game" :disabled="!run">
        <StopIcon :disabled="!run" />
      </button>
    </div>
    <div class="instructions-list">
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

    <div class="selections color-selections">
      <button class="color-box color-box-green" @click="select_green"></button>
      <button class="color-box color-box-blue" @click="select_blue"></button>
      <button class="color-box color-box-red" @click="select_red"></button>
    </div>
    <div class="fo">
      <span class="fo-span">f0 =</span>
      <div v-for="(item, i) in f0">
        <div key="i" :class="`fo-item fo-item-${i}`" @click="select_box(i)">
          <TurnRight v-if="item[0] == 0" />
          <TurnLeft v-if="item[0] == 1" />
          <Move v-if="item[0] == 2" />
          <span class="fo-span" v-if="item[0] == 'f0'">f0</span>
          <span class="fo-span" v-if="item[0] == 'f1'">f1</span>
        </div>
      </div>
    </div>
    <button class="btn reset-btn" @click="reset_f0" :disabled="run">
      <ResetIcon :disabled="run" />
    </button>
    <div class="description">
      <p>
        {{ level_data?.description }}
      </p>
    </div>
  </main>
</template>
<style scoped>
.reset-btn {
  margin: 1rem;
}
.level {
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 1rem;
}
.description {
  width: 900px;
  font-size: larger;
  margin: 1rem;
  font-display: block;
}
.btns {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}
.btn {
  padding: auto;
  width: 40px;
  height: 40px;
}
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

.color-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-width: 2px;
}
.color-box-green {
  background-color: #6aa84f;
}
.color-box-red {
  background-color: #d70909;
}
.color-box-blue {
  background-color: #1369b7;
}

.fo {
  display: flex;

  justify-content: start;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}
</style>
