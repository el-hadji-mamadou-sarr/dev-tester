export interface Level {
  plane_pos: { x: number; y: number }
  gameMap: number[][]
  objectives: { x: number; y: number }[]
  plane_direction: string
  description: string
}
