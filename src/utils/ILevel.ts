export interface Level {
  block_rows: (null | any)[]
  block_cols: (null | any)[]
  plane_pos: { x: number; y: number }
  gameMap: number[][]
  objectives: { x: number; y: number }[]
}
