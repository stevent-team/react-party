
import {useEffect, useRef, useCallback} from 'react'

import { CONFETTI_COLORS } from '/lib/config'
import { useAnimationFrame, chooseWeighted } from '/lib/util'
import { TAU } from './config'
import { SHAPE_DRAWING_FUNCTIONS } from './drawing'

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
  killZoneWidth=50,
  colors = CONFETTI_COLORS,
  shapeDrawingFunctions = SHAPE_DRAWING_FUNCTIONS,
  shapeWeights = {
    triangle: 2,
    circle: 1,
    star: 1,
    line: 1,
  },
} = {}) => {
  const particlesRef = useRef([])

  const showConfetti = useCallback(({
    count = 75,
    duration = 0,
    sourceRef
  } = {}) => {
    const {left, top, width, height} = sourceRef?.current?.getBoundingClientRect()
      ?? document.activeElement?.getBoundingClientRect()
      ?? document.body.getBoundingClientRect()

    particlesRef.current = [
      ...particlesRef.current,
      ...Array.from({length: count}, () => {
        const [x, y] = [left + Math.random() * width, top + Math.random() * height]
        const [cx, cy] = [left + width / 2, top + height / 2]
        const a = Math.atan2(y - cy, x - cx)
        const vx = Math.cos(a) * Math.random() * xVelocityVariance + xVelocityBase
        const vy = Math.sin(a) * Math.random() * yVelocityVariance + yVelocityBase
        return {
          x,
          y,
          vx,
          vy,
          delayUntil: performance.now() + (Math.random() * duration),
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

  const Confetti = () => {
    const canvasRef = useRef()
    const canvasBBRef = useRef()
    const ctxRef = useRef()

    const onCanvasResize = useCallback(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const canvasBB = canvas.getBoundingClientRect()
        const { width, height } = canvasBB
        const scale = window.devicePixelRatio
        canvasBBRef.current = canvasBB
        canvas.scale = scale
        canvas.width = Math.floor(width * scale)
        canvas.height = Math.floor(height * scale) 
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
      if (canvasRef.current && ctxRef.current && canvasBBRef.current) {
        // Get context and bb
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        const scale = canvas.scale
        const {width: canvasWidth, height: canvasHeight, left: canvasLeft, top: canvasTop} = canvasBBRef.current
        const [width, height] = [canvasWidth * scale, canvasHeight * scale]

        // Update particles
        particlesRef.current = particlesRef.current.map((p) => {
          // Still waiting for delay?
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
        particlesRef.current = particlesRef.current.filter(p => {
          if (currentTime < p.delayUntil) return true
          if (p.x < -killZoneWidth || p.x > width + killZoneWidth) return false
          if (p.y < -killZoneWidth || p.y > height + killZoneWidth) return false
          return true
        })

        // Render particles
        ctx.clearRect(0, 0, width * scale, height * scale)
        particlesRef.current.forEach(p => {
          // Still waiting for delay?
          if (currentTime < p.delayUntil) return

          const [x, y] = [p.x - canvasLeft, p.y - canvasTop] //[p.x * width, p.y * height]
          const drawFn = shapeDrawingFunctions[p.shape]
          drawFn({ p, x, y, ctx, scale })
        })
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          pointerEvents: 'none',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    )
  }

  return {Confetti, showConfetti}
}

export default useConfetti
