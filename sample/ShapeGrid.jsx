import { useControls } from 'leva'
import { useEffect, useRef, useCallback } from 'react'
import { DEFAULT_SHAPE_FUNCTIONS } from '@stevent-team/react-party'
import { useAnimationFrame } from '/lib/util'
import { drawCrescentParticle, drawRegularPolygonParticle } from '/lib'

const gridStyle = {
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  margin: 0,
  padding: '3em',
  paddingRight: '20em',
  boxSizing: 'border-box',
}

const cellStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1',
  outline: '1px solid grey',
}

const canvasStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

const ShapeGrid = () => {
  const genericOptions = useControls('Generic options', {
    diameterPortion: { value: 0.9, min: 0, max: 2 },
    flip: { value: 0, min: 0, max: 360 },
    angle: { value: 0, min: 0, max: 360 },
    twirl: { value: 0, min: 0, max: 1 },
    color: 'white',
  })

  const { color: polygonColor, ...polygonOptions }= useControls('Dynamic Polygon Options', {
    numPoints: { value: 3, min: 1, step: 1, max: 20 },
    startAngle: { value: 0, min: 0, max: 6.28 },
    spiked: false,
    spikedPortion: { value: .5, min: 0, max: 1 },
    color: '#64c0de'
  })

  const { color: crescentColor, ...crescentOptions }= useControls('Dynamic Crescent Options', {
    forwardPortion: { value: .5, min: 0, max: 2 },
    backwardPortion: { value: 1, min: 0, max: 2 },
    horizontalShiftPortion: { value: 0.4, min: 0, max: 1 },
    verticalShiftPortion: { value: 0.25, min: 0, max: 1 },
    innerControlPortion: { value: 0.6, min: 0, max: 2 },
    outerControlPortion: { value: 1, min: 0, max: 2 },
    color: '#64c0de'
  })

  return <div style={gridStyle}>
    {/* Dynamic polygon */}
    <ShapeCell shapeFn={drawRegularPolygonParticle(polygonOptions)} {...genericOptions} color={polygonColor} />

    {/* Dynamic crescent */}
    <ShapeCell shapeFn={drawCrescentParticle(crescentOptions)} {...genericOptions} color={crescentColor} />

    {/* Built-in shapes */}
    {Object.keys(DEFAULT_SHAPE_FUNCTIONS).map(shape =>
      <ShapeCell shapeFn={DEFAULT_SHAPE_FUNCTIONS[shape]} key={shape} {...genericOptions} />)}
  </div>
}

const ShapeCell = ({
  shapeFn=DEFAULT_SHAPE_FUNCTIONS.triangle,
  color='white',
  diameterPortion=.9,
  flip=0,
  angle=0,
  twirl=0,
}) => {
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
      // Get canvas context
      ctxRef.current = canvasRef.current.getContext('2d')

      // Observe for canvas size changes
      const resizeObserver = new ResizeObserver(onCanvasResize)
      resizeObserver.observe(canvasRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [])

  useAnimationFrame(() => {
    if (ctxRef.current && canvasBBoxRef.current) {
      const { width, height } = canvasRef.current
      const bb = canvasBBoxRef.current

      // Clear canvas
      ctxRef.current.clearRect(0, 0, width, height)

      // Render particle
      const diameter = Math.max(bb.width, bb.height) * diameterPortion
      ctxRef.current.setTransform(
        new DOMMatrixReadOnly()
          .translate(-twirl*diameter*window.devicePixelRatio, -twirl*diameter*window.devicePixelRatio)
          .translate(width/2, height/2)
          .scale(window.devicePixelRatio)
          .rotate(angle)
          .translate(twirl*diameter*window.devicePixelRatio, twirl*diameter*window.devicePixelRatio)
          .scale(1, Math.sin(((flip+90)*(Math.PI/180))))
      )
      shapeFn({ ctx: ctxRef.current, p: {
        flip,
        angle,
        diameter,
        color,
      }})
      ctxRef.current.setTransform(1,0,0,1,0,0)
    }
  })

  return <div style={cellStyle}>
    <canvas ref={canvasRef} style={canvasStyle} />
  </div>
}

export default ShapeGrid
