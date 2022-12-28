import { ConfettiOptions } from './options'
import { Particle, ShapeDrawingFunction, ShapeName } from './types'
import { randMinMax, randWeighted } from './util'

/**
 * Render a particle in the simulation to a canvas
 * @param ctx The context of the canvas to render to
 * @param p The particle to render
 * @param boundingBox The bounding box of the canvas to render to
 * @param transformMatrix The transform matrix to apply before rendering
 * @param shapeFunctions The simulations shape functions map
 */
export const renderParticle = (
  ctx: CanvasRenderingContext2D,
  p: Particle,
  boundingBox: DOMRect,
  transformMatrix: DOMMatrix,
  shapeFunctions: Record<ShapeName, ShapeDrawingFunction>
) => {
  const [x, y] = [p.x - boundingBox.left, p.y - boundingBox.top]
  ctx.setTransform(transformMatrix
    .translate(x, y)
    .rotate(p.angle)
    .scale(1, Math.sin(((p.flip+90)*(Math.PI/180))))
    .translate(-p.twirl*p.diameter, -p.twirl*p.diameter)
  )
  shapeFunctions[p.shape]({ p, ctx })
  ctx.setTransform(1,0,0,1,0,0)
}

/**
 * Update a particle in the simulation.
 * Will return undefined if the particle should be removed from the simulation
 * @param p The particle to update
 * @param currentTime The timestamp for this frame
 * @param width The width of the simulation world
 * @param height The height of the simulation world
 * @param options The options for the simulation
 * @returns Either a new updated particle or undefined
 */
type UpdateParticleResult = { particle: Particle | undefined, visible: boolean }
export const updateParticle = (
  p: Particle,
  currentTime: number,
  width: number,
  height: number,
  options: ConfettiOptions
): UpdateParticleResult => {
  // Still delayed? Don't update yet
  if (currentTime < p.delayUntil) return { particle: p, visible: false }

  // Remove off-screen particles
  if (p.x < -options.killDistance/window.devicePixelRatio
    || p.x > (width + options.killDistance)/window.devicePixelRatio
    || p.y < -options.killDistance/window.devicePixelRatio
    || p.y > (height + options.killDistance)/window.devicePixelRatio
  ) return { particle: undefined, visible: false }

  // Compute flip increment
  const flipIncrement = p.flipIncrement * (
    options.rotationVelocityCoefficient ? Math.min(Math.max(p.vy, p.vx), 2) * options.rotationVelocityCoefficient : 1
  )

  // Compute updated particle position, movement, rotation etc
  const updated = {
    ...p,
    vy: p.vy + ((options.gravity/100) * options.speed),
    vx: p.vx + (options.wind * options.speed),
    x: p.x + (p.vx * options.speed),
    y: p.y + (p.vy * options.speed),
    flip: p.flip + (flipIncrement * options.speed),
    angle: p.angle + (p.angleIncrement * options.speed),
  }

  return { particle: updated, visible: true }
}

/**
 * Create a new random particle for the simulation
 * @param source A HTML element to emit the particle from
 * @param lastFrameTime The timestamp of the previous frame (used for particle emission over time)
 * @param options The options of the particle simulation
 * @returns The new particle
 */
export const createRandomParticle = (
  source: Element,
  lastFrameTime: number,
  options: ConfettiOptions
): Particle => {
  const { left, top, width, height } = source.getBoundingClientRect()
  const [vxInitial, vyInitial] = options.initialVelocity
  const [vxSpread, vySpread] = options.initialVelocitySpread
  const [x, y] = [left + Math.random() * width, top + Math.random() * height]
  const [cx, cy] = [left + width / 2, top + height / 2]
  const a = Math.atan2(y - cy, x - cx)
  const vx = Math.cos(a) * Math.random() * vxSpread + vxInitial
  const vy = Math.sin(a) * Math.random() * vySpread + vyInitial
  return {
    x, y,
    vx, vy,
    delayUntil: lastFrameTime + (Math.random() * options.duration),
    diameter: randMinMax(options.diameter),
    color: options.colors[(Math.random() * options.colors.length) | 0],
    shape: randWeighted(options.shapeWeights),
    twirl: randMinMax(options.twirl),
    flip: randMinMax(options.initialFlip),
    flipIncrement: randMinMax(options.flipIncrement),
    angle: randMinMax(options.initialAngle),
    angleIncrement: randMinMax(options.angleIncrement),
  }
}
