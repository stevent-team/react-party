import { useEffect, useRef, useCallback } from 'react'

import { CONFETTI_COLORS } from '/lib/config'
import { useAnimationFrame, chooseWeighted } from '/lib/util'
import { TAU } from './config'
import { SHAPE_DRAWING_FUNCTIONS } from './drawing'

const canvasStyle = {
  display: 'block',
  position: 'absolute',
  pointerEvents: 'none',
  inset: 0,
  width: '100%',
  height: '100%',
}

const useConfetti = ({
  gravity = 1.3,
  simulationSpeed = 1.5,
  tiltAmount = 15,
  xVelocityBase = 0,
  xVelocityVariance = 1.5,
  yVelocityBase = -1,
  yVelocityVariance = 3,
  diameterBase = 5,
  diameterVariance = 10,
  tiltBase = -10,
  tiltVariance = 10,
  tiltAngleBase = 0,
  tiltAngleVariance = TAU,
  tiltAngleIncrementBase = 0.05,
  tiltAngleIncrementVariance = 0.07,
  killDistance = 100,
  colors = CONFETTI_COLORS,
  shapeDrawingFunctions = SHAPE_DRAWING_FUNCTIONS,
  shapeWeights = {
    triangle: 1,
    circle: 1,
    star: 1,
    line: 1,
  },
} = {}) => {
  const particles = useRef([])
  const lastFrameTime = useRef(0)

  const createConfetti = useCallback(({
    count = 75,
    duration = 0,
    sourceRef,
  } = {}) => {
    // Choose where the confetti will spawn
    const source = sourceRef?.current ?? document.activeElement ?? document.body
    const { left, top, width, height } = source.getBoundingClientRect()

    // Add confetti to the particle array
    particles.current = [
      ...particles.current,
      ...Array.from({length: count}, () => {
        const [x, y] = [left + Math.random() * width, top + Math.random() * height]
        const [cx, cy] = [left + width / 2, top + height / 2]
        const a = Math.atan2(y - cy, x - cx)
        const vx = Math.cos(a) * Math.random() * xVelocityVariance + xVelocityBase
        const vy = Math.sin(a) * Math.random() * yVelocityVariance + yVelocityBase
        return {
          x, y,
          vx, vy,
          delayUntil: lastFrameTime.current + (Math.random() * duration),
          diameter: Math.random() * diameterVariance + diameterBase,
          tilt: Math.random() * tiltVariance + tiltBase,
          tiltAngleIncrement: Math.random() * tiltAngleIncrementVariance + tiltAngleIncrementBase,
          tiltAngle: Math.random() * tiltAngleVariance + tiltAngleBase,
          color: colors[(Math.random() * colors.length) | 0],
          shape: chooseWeighted(shapeWeights, Math.random()),
        }
      }),
    ]
  },
  [
    xVelocityBase,
    xVelocityVariance,
    yVelocityBase,
    yVelocityVariance,
    diameterBase,
    diameterVariance,
    tiltBase,
    tiltVariance,
    tiltAngleBase,
    tiltAngleVariance,
    tiltAngleIncrementBase,
    tiltAngleIncrementVariance,
    shapeWeights,
  ])

  const Confetti = ({ style = {}, ...props }) => {
    const canvasRef = useRef()
    const canvasBBoxRef = useRef()
    const ctxRef = useRef()

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
      }
    }, [])

    // Observe for canvas size changes
    useEffect(() => {
      if (canvasRef.current) {
        const resizeObserver = new ResizeObserver(onCanvasResize)
        resizeObserver.observe(canvasRef.current)

        return () => resizeObserver.disconnect()
      }
    }, [])

    // Apply context
    useEffect(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctxRef.current = ctx
      }
    }, [])

    // Render onto canvas
    useAnimationFrame(currentTime => {
      lastFrameTime.current = currentTime

      if (ctxRef.current && canvasBBoxRef.current) {
        const ctx = ctxRef.current
        const { top: canvasTop, left: canvasLeft } = canvasBBoxRef.current
        const scale = window.devicePixelRatio
        const { width, height } = canvasRef.current

        // Update particles
        particles.current = particles.current.map(p => {
          // Still delayed?
          if (currentTime < p.delayUntil) return p

          const speed = simulationSpeed / 10
          const g = gravity / 100
          return {
            ...p,
            tiltAngle: p.tiltAngle + p.tiltAngleIncrement,
            vy: p.vy + g * scale,
            x: p.x + p.vx * p.diameter * scale * speed,
            y: p.y + p.vy * p.diameter * scale * speed,
            tilt: Math.sin(p.tiltAngle) * tiltAmount,
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
          // Still waiting for delay?
          if (currentTime < p.delayUntil) return

          const [x, y] = [p.x - canvasLeft, p.y - canvasTop]
          shapeDrawingFunctions[p.shape]({ p, x, y, ctx, scale })
        })
      }
    })

    return <canvas ref={canvasRef} style={{ ...canvasStyle, ...style }} {...props} />
  }

  return { Confetti, createConfetti }
}

export default useConfetti
