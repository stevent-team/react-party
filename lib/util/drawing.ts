import type { DrawShapeArguments, ShapeDrawingFunction } from '../types'

export const drawLineParticle = ({ ctx, p }: DrawShapeArguments) => {
  ctx.beginPath()
  ctx.lineCap = 'butt'
  ctx.lineWidth = p.diameter
  ctx.strokeStyle = p.color
  ctx.moveTo(0, 0)
  ctx.lineTo(0, p.diameter/2)
  ctx.stroke()
}

export const drawCircleParticle = ({ ctx, p }: DrawShapeArguments) => {
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.ellipse(
    0, 0,
    p.diameter/2.5, p.diameter/2.5,
    0, 0, Math.PI*2
  )
  ctx.fill()
}

export const drawCrescentParticle = ({
  forwardPortion = 0.5,
  backwardPortion = 1,
  horizontalShiftPortion = 0.4,
  verticalShiftPortion = 0.25,
  innerControlPortion = .6,
  outerControlPortion = 1,
}={}) => ({ ctx, p }: DrawShapeArguments) => {
  const r = p.diameter/2
  const xShiftAmount = r * horizontalShiftPortion
  const innerControlRadius = r*innerControlPortion
  const outerControlRadius = r*outerControlPortion
  const x1 = r * forwardPortion
  const x2 = r * backwardPortion
  const y2 = r - (r * verticalShiftPortion)
  const y1 = -r + (r * verticalShiftPortion)
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.moveTo(x1, y1) // Start at top right corner
  ctx.bezierCurveTo( // curve to bottom right corner (front curve)
    -xShiftAmount, -innerControlRadius, // control1: top left corner
    -xShiftAmount, innerControlRadius, // control2: bottom left corner
    x1, y2,
  )
  ctx.bezierCurveTo( // curve to top right corner (back curve)
    -x2, outerControlRadius, // control1: bottom left corner
    -x2, -outerControlRadius, // control2: top left corner
    x1, y1,
  )
  ctx.fill()
}

export const drawImageParticle = (image: CanvasImageSource) => ({ ctx, p }: DrawShapeArguments) => {
  ctx.drawImage(
    image,
    -p.diameter/2, -p.diameter/2,
    p.diameter, p.diameter
  )
}

export const drawRegularPolygonParticle = ({
  numPoints = 3,
  spiked = false,
  spikedPortion = .5,
  fill = true,
  startAngle = Math.PI/4,
} = {}) => ({ ctx, p }: DrawShapeArguments) => {
  // Determine change in angle
  const dTheta = (Math.PI*2) / numPoints
  const expand = 1

  // Centre point
  const [x, y] = [0, 0]

  // Start a path
  ctx.beginPath()
  ctx.fillStyle = p.color
  ctx.lineWidth = p.diameter/5
  ctx.strokeStyle = p.color

  // Create points for each vertex of the polygon
  for (let i = 0; i < numPoints + 1; i++) {
    // Determine point position using current angle
    // (the modulus is to close the loop)
    const theta = startAngle + (i % numPoints) * dTheta
    const px = x + Math.cos(theta) * p.diameter/2 * expand
    const py = y + Math.sin(theta) * p.diameter/2 * expand

    // Spiked polygons have an extra point
    if (spiked) {
      const thetaMid = startAngle + ((i % numPoints) - 0.5) * dTheta
      const px = x + spikedPortion * Math.cos(thetaMid) * p.diameter/2 * expand
      const py = y + spikedPortion * Math.sin(thetaMid) * p.diameter/2 * expand
      ctx.lineTo(px, py)
    }

    // Render the next line or move into position ready to do so
    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
  }

  // Complete the stroke
  if (fill) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

export const DEFAULT_SHAPE_FUNCTIONS = {
  line: drawLineParticle,
  circle: drawCircleParticle,
  moon: drawCrescentParticle(),

  triangle: drawRegularPolygonParticle({ numPoints: 3 }),
  square: drawRegularPolygonParticle({ numPoints: 4 }),
  pentagon: drawRegularPolygonParticle({ numPoints: 5 }),
  hexagon: drawRegularPolygonParticle({ numPoints: 6 }),
  heptagon: drawRegularPolygonParticle({ numPoints: 7 }),
  octagon: drawRegularPolygonParticle({ numPoints: 8 }),

  diamond: drawRegularPolygonParticle({ numPoints: 4, spiked: true }),
  star: drawRegularPolygonParticle({ numPoints: 5, spiked: true }),
  hexagram: drawRegularPolygonParticle({ numPoints: 6, spiked: true }),
} as Record<string, ShapeDrawingFunction>
