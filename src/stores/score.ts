import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getScore, saveScore } from '@/utils/storage'

export const useUserScore = defineStore('userScore', () => {
  const score = ref(getScore())
  function level_up() {
    score.value++
    saveScore(score.value)
  }

  return { score, level_up }
})
