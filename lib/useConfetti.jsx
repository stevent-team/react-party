import { useEffect, useRef, useCallback } from 'react'

import { DEFAULT_COLORS } from './config'
import { useAnimationFrame, randWeighted, randMinMax } from './util'
import { DEFAULT_SHAPE_FUNCTIONS } from './util/drawing'

const useConfetti = ({
  gravity = 9.8,
  wind = 0,
  speed = 1,
  killDistance = 100,

  count = 75,
  duration = 0,

  initialVelocity = [0, -3],
  initialVelocitySpread = [5, 7],

  diameter = [10, 30],

  twirl = [0, .2],

  initialAngle = [0, 360],
  angleIncrement = [-10, 10],

  initialFlip = [0, 360],
  flipIncrement = [-10, 10],

  rotationVelocityCoefficient = .8,

  colors = DEFAULT_COLORS,
  shapeFunctions = DEFAULT_SHAPE_FUNCTIONS,
  shapeWeights = {
    triangle: 1,
    circle: 1,
    star: 1,
    square: 1,
  },
} = {}) => {
  // Setup references
  const particles = useRef([])
  const lastFrameTime = useRef(0)
  const canvasRef = useRef()
  const canvasBBoxRef = useRef()
  const ctxRef = useRef()
  const transformMatrix = useRef(new DOMMatrix().scale(window.devicePixelRatio))

  const createConfetti = useCallback(async ({
    count = count,
    duration = duration,
    sourceRef,
  } = {}) => {
    // Choose where the confetti will spawn
    const source = sourceRef?.current ?? document.activeElement ?? document.body
    const { left, top, width, height } = source.getBoundingClientRect()

    // Add confetti to the particle array
    particles.current = [
      ...particles.current,
      ...Array.from({ length: count }, () => {
        const [vxInitial, vyInitial] = initialVelocity
        const [vxSpread, vySpread] = initialVelocitySpread
        const [x, y] = [left + Math.random() * width, top + Math.random() * height]
        const [cx, cy] = [left + width / 2, top + height / 2]
        const a = Math.atan2(y - cy, x - cx)
        const vx = Math.cos(a) * Math.random() * vxSpread + vxInitial
        const vy = Math.sin(a) * Math.random() * vySpread + vyInitial
        return {
          x, y,
          vx, vy,
          delayUntil: lastFrameTime.current + (Math.random() * duration),
          diameter: randMinMax(diameter),
          color: colors[(Math.random() * colors.length) | 0],
          shape: randWeighted(shapeWeights),
          twirl: randMinMax(twirl),
          flip: randMinMax(initialFlip),
          flipIncrement: randMinMax(flipIncrement),
          angle: randMinMax(initialAngle),
          angleIncrement: randMinMax(angleIncrement),
        }
      }),
    ]
  },
  [
    count, duration, colors, shapeWeights,
    initialVelocity, initialVelocitySpread,
    diameter, twirl,
    initialFlip, flipIncrement,
    initialAngle, angleIncrement,
  ])

  const onCanvasResize = useCallback(() => {
    if (canvasRef.current) {
      // Get canvas bounding box
      const canvasBBox = canvasRef.current.getBoundingClientRect()
      const { width, height } = canvasBBox
      canvasBBoxRef.current = canvasBBox

      // Set canvas size
      const scale = window.devicePixelRatio
      canvasRef.current.width = Math.floor(width * scale)
      canvasRef.current.height = Math.floor(height * scale)

      transformMatrix.current = new DOMMatrix().scale(scale)
    }
  }, [])

  // Observe for canvas size changes
  useEffect(() => {
    if (canvasRef.current) {
      // Get canvas context
      ctxRef.current = canvasRef.current.getContext('2d')

      // Observe for canvas size changes
      const resizeObserver = new ResizeObserver(onCanvasResize)
      resizeObserver.observe(canvasRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [])

  // Render onto canvas
  useAnimationFrame(currentTime => {
    lastFrameTime.current = currentTime

    if (ctxRef.current && canvasBBoxRef.current) {
      const { width, height } = canvasRef.current

      // Clear canvas
      ctxRef.current.clearRect(0, 0, width, height)

      // Update particles
      particles.current = particles.current.reduce((all, p) => {
        // Still delayed?
        if (currentTime < p.delayUntil) return [...all, p]

        // Remove off-screen particles
        if (p.x < -killDistance/window.devicePixelRatio
          || p.x > (width + killDistance)/window.devicePixelRatio
          || p.y < -killDistance/window.devicePixelRatio
          || p.y > (height + killDistance)/window.devicePixelRatio
        ) return all

        // Render particle
        const [x, y] = [p.x - canvasBBoxRef.current.left, p.y - canvasBBoxRef.current.top]
        ctxRef.current.setTransform(transformMatrix.current.translate(x, y).rotate(p.angle).scale(1, Math.sin(((p.flip+90)*(Math.PI/180)))))
        shapeFunctions[p.shape]({ p, ctx: ctxRef.current })
        ctxRef.current.setTransform(1,0,0,1,0,0)

        return [...all, {
          ...p,
          vy: p.vy + ((gravity/100) * speed),
          vx: p.vx + (wind * speed),
          x: p.x + (p.vx * speed),
          y: p.y + (p.vy * speed),
          flip: p.flip + (p.flipIncrement * (rotationVelocityCoefficient ? Math.min(Math.max(p.vy, p.vx), 2) * rotationVelocityCoefficient : 1) * speed),
          angle: p.angle + (p.angleIncrement * speed),
        }]
      }, [])
    }
  })

  return { createConfetti, canvasRef }
}

export default useConfetti
