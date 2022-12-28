export type ShapeName = string
export type Particle = {
  x: number,
  y: number,
  vx: number,
  vy: number,
  delayUntil: number,
  diameter: number,
  color: string,
  twirl: number
  flip: number
  flipIncrement: number
  angle: number,
  angleIncrement: number
  shape: ShapeName,
}

export type DrawShapeArguments = { ctx: CanvasRenderingContext2D, p: Particle }
export type ShapeDrawingFunction = ({ ctx, p }: DrawShapeArguments) => void 
