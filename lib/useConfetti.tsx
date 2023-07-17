import { useEffect, useRef, useCallback } from 'react'

import { CANVAS_STYLE } from './config'
import { useAnimationFrame } from './util'
import type { Particle } from './types'
import { ConfettiOptions, CreateConfettiOptions, DEFAULT_CONFETTI_OPTIONS, } from './options'
import { createRandomParticle, renderParticle, updateParticle } from './confetti'

const useConfetti = (confettiOptions: Partial<ConfettiOptions> = {}) => {
  // Merge options
  const options: ConfettiOptions = { ...DEFAULT_CONFETTI_OPTIONS, ...confettiOptions }

  // Setup references
  const particles = useRef<Particle[]>([])
  const lastFrameTime = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>()
  const canvasBBoxRef = useRef<DOMRect>()
  const ctxRef = useRef<CanvasRenderingContext2D>()
  const transformMatrix = useRef<DOMMatrix>()

  // Creating a scope for parameters so they are not self-shadowed
  const createConfetti = useCallback(async (createConfettiOptions: Partial<CreateConfettiOptions> = {}) => {
    // Choose where the confetti will spawn
    const source: Element = createConfettiOptions.sourceRef?.current ?? document.activeElement ?? document.body

    // Add confetti to the particle array
    const mergedOpts = { ...options, ...createConfettiOptions }
    particles.current = [
      ...particles.current,
      ...Array.from({ length: mergedOpts.count }, () => createRandomParticle(
        source, lastFrameTime.current, mergedOpts
      )),
    ]
  }, [ options ])

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

      transformMatrix.current = new DOMMatrixReadOnly().scale(scale)
    }
  }, [])

  // Observe for canvas size changes
  useEffect(() => {
    if (canvasRef.current) {
      // Get canvas context
      ctxRef.current = canvasRef.current.getContext('2d')!

      // Observe for canvas size changes
      const resizeObserver = new ResizeObserver(onCanvasResize)
      resizeObserver.observe(canvasRef.current)

      return () => resizeObserver.disconnect()
    }
    return undefined
  }, [])

  // Render onto canvas
  useAnimationFrame(currentTime => {
    lastFrameTime.current = currentTime

    const ctx = ctxRef.current
    if (ctx && canvasBBoxRef.current && canvasRef.current) {
      const { width, height } = canvasRef.current

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update particles
      particles.current = particles.current.reduce<Particle[]>((all, p) => {
        // Update the particle (and potentially cull it)
        const { particle, visible } = updateParticle(p, currentTime, width, height, options)
        if (!particle) return all

        // Render it
        if (visible) {
          renderParticle(
            ctx,
            particle,
            canvasBBoxRef.current!,
            transformMatrix.current ?? new DOMMatrixReadOnly().scale(window.devicePixelRatio),
            options.shapeFunctions
          )
        }

        // Keep it
        return [...all, particle]
      }, [])
    }
  })

  return {
    createConfetti,
    canvasProps: {
      ref: canvasRef,
      style: CANVAS_STYLE,
    },
  }
}

export default useConfetti
