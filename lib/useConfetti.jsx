import { useEffect, useRef, useCallback } from 'react'

import { DEFAULT_COLORS } from './config'
import { useAnimationFrame, randWeighted, randBetween } from './util'
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

  diameterMin = 10,
  diameterMax = 30,

  twirlMin = 0,
  twirlMax = .2,

  initialAngleMin = 0,
  initialAngleMax = 360,
  angleIncrementMin = -10,
  angleIncrementMax = 10,

  initialFlipMin = 0,
  initialFlipMax = 360,
  flipIncrementMin = -10,
  flipIncrementMax = 10,

  rotationAndVelocityLink = .8,

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
      ...Array.from({length: count}, () => {
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
          delayUntil: randBetween(lastFrameTime.current, lastFrameTime.current + duration),
          diameter: randBetween(diameterMin, diameterMax),
          color: colors[(Math.random() * colors.length) | 0],
          shape: randWeighted(shapeWeights),
          twirl: randBetween(twirlMin, twirlMax),
          flip: randBetween(initialFlipMin, initialFlipMax),
          flipIncrement: randBetween(flipIncrementMin, flipIncrementMax),
          angle: randBetween(initialAngleMin, initialAngleMax),
          angleIncrement: randBetween(angleIncrementMin, angleIncrementMax),
        }
      }),
    ]
  },
  [
    count, duration, colors, shapeWeights,
    initialVelocity, initialVelocitySpread,
    diameterMin, diameterMax,
    twirlMin, twirlMax,
    initialFlipMin, initialFlipMax,
    flipIncrementMin, flipIncrementMax,
    initialAngleMin, initialAngleMax,
    angleIncrementMin, angleIncrementMax,
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
      const ctx = ctxRef.current
      const { top: canvasTop, left: canvasLeft } = canvasBBoxRef.current
      const { width, height } = canvasRef.current

      // Update particles
      particles.current = particles.current.map(p => {
        // Still delayed?
        if (currentTime < p.delayUntil) return p

        return {
          ...p,
          vy: p.vy + ((gravity/100) * speed),
          vx: p.vx + (wind * speed),
          x: p.x + (p.vx * speed),
          y: p.y + (p.vy * speed),
          flip: p.flip + (p.flipIncrement * (rotationAndVelocityLink ? Math.min(Math.max(p.vy, p.vx), 2) * rotationAndVelocityLink : 1) * speed),
          angle: p.angle + (p.angleIncrement * speed),
        }
      })

      // Remove off-screen particles
      particles.current = particles.current.filter(p => {
        if (currentTime < p.delayUntil) return true
        if (p.x < -killDistance || p.x > width + killDistance) return false
        if (p.y < -killDistance || p.y > height + killDistance) return false
        return true
      })

      // Render particles
      ctx.clearRect(0, 0, width, height)
      particles.current.forEach(p => {
        // Still delayed?
        if (currentTime < p.delayUntil) return

        const [x, y] = [p.x - canvasLeft, p.y - canvasTop]
        ctx.setTransform(transformMatrix.current.translate(x, y).rotate(p.angle).scale(1, Math.sin(((p.flip+90)*(Math.PI/180)))))
        shapeFunctions[p.shape]({ p, ctx })
        ctx.setTransform(1,0,0,1,0,0)
      })
    }
  })

  return { createConfetti, canvasRef }
}

export default useConfetti
