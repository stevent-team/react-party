import { TAU } from './config'

export const drawLineParticle = ({ ctx, x, y, p, scale }) => {
  const tx = x + p.tilt
  ctx.beginPath()
  ctx.lineCap = 'butt'
  ctx.lineWidth = p.diameter * scale
  ctx.strokeStyle = p.color
  ctx.moveTo((tx + p.diameter / 2) * scale, y * scale)
  ctx.lineTo(tx * scale, (y + p.tilt + p.diameter / 2) * scale)
  ctx.stroke()
}

export const drawCircleParticle = ({ ctx, x, y, p, scale }) => {
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.ellipse(
    x * scale,
    y * scale,
    (p.diameter / 1.5) * scale * (1 + p.tilt / 100),
    (p.diameter / 1.5) * scale,
    0,
    0,
    TAU
  )
  ctx.fill()
}

export const makeDrawRegularPolygonParticle = ({ numPoints=3, spiked=false, spikedPortion=.5, fill=true }={}) => ({ ctx, x, y, p, scale }) => {
  // Determine change in angle
  const dTheta = TAU / numPoints

  // Determine center
  const [cx, cy] = [x * scale, y * scale]

  // Start a path
  ctx.beginPath()
  ctx.fillStyle = p.color
  ctx.strokeStyle = p.color

  // Create points for each vertex of the polygon
  for (let i = 0; i < numPoints + 1; i++) {
    // Determine point position using current angle
    // (the modulus is to close the loop)
    const theta = p.tilt / 50 + (i % numPoints) * dTheta
    const px = cx + Math.cos(theta) * scale * p.diameter * (1 + p.tilt / 100)
    const py = cy + Math.sin(theta) * scale * p.diameter * (1 + Math.sin(p.tilt / 50))

    // Spiked polygons have an extra point
    if (spiked) {
      const thetaMid = p.tilt / 50 + ((i % numPoints) - 0.5) * dTheta
      const px = cx + spikedPortion * Math.cos(thetaMid) * scale * p.diameter * (1 + p.tilt / 100)
      const py = cy + spikedPortion * Math.sin(thetaMid) * scale * p.diameter * (1 + Math.sin(p.tilt / 50))
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

export const SHAPE_DRAWING_FUNCTIONS = {
  'line': drawLineParticle,
  'circle': drawCircleParticle,
  'triangle': makeDrawRegularPolygonParticle({ numPoints: 3 }),
  'pentagon': makeDrawRegularPolygonParticle({ numPoints: 5 }),
  'hexagon': makeDrawRegularPolygonParticle({ numPoints: 6 }),
  'heptagon': makeDrawRegularPolygonParticle({ numPoints: 7 }),
  'octagon': makeDrawRegularPolygonParticle({ numPoints: 8 }),
  'star': makeDrawRegularPolygonParticle({ numPoints: 5, spiked: true }),
}
