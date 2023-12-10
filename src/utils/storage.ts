export const saveScore = (score: number) => {
  localStorage.setItem('score', score.toString())
}

export const getScore = () => {
  const scoreString = localStorage.getItem('score')
  if (scoreString === null) {
    return 0
  }
  return parseFloat(scoreString)
}
