export const drawLineParticle = ({ ctx, p }) => {
  ctx.beginPath()
  ctx.lineCap = 'butt'
  ctx.lineWidth = p.diameter
  ctx.strokeStyle = p.color
  ctx.moveTo(-p.diameter * p.twirl, 0)
  ctx.lineTo(-p.diameter * p.twirl, p.diameter/2)
  ctx.stroke()
}

export const drawCircleParticle = ({ ctx, p }) => {
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.ellipse(
    -p.diameter * p.twirl, -p.diameter * p.twirl,
    p.diameter/2.5, p.diameter/2.5,
    0, 0, Math.PI*2
  )
  ctx.fill()
}

export const drawImageParticle = image => ({ ctx, p }) => {
  ctx.drawImage(
    image,
    -p.diameter/2 - p.diameter*p.twirl, -p.diameter/2 - p.diameter*p.twirl,
    p.diameter, p.diameter
  )
}

export const drawRegularPolygonParticle = ({
  numPoints = 3,
  spiked = false,
  spikedPortion = .5,
  fill = true,
  startAngle = Math.PI/4,
} = {}) => ({ ctx, p }) => {
  // Determine change in angle
  const dTheta = (Math.PI*2) / numPoints

  // Centre point
  const [x, y] = [-p.diameter * p.twirl, -p.diameter * p.twirl]

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
    const px = x + Math.cos(theta) * p.diameter/2
    const py = y + Math.sin(theta) * p.diameter/2

    // Spiked polygons have an extra point
    if (spiked) {
      const thetaMid = startAngle + ((i % numPoints) - 0.5) * dTheta
      const px = x + spikedPortion * Math.cos(thetaMid) * p.diameter/2
      const py = y + spikedPortion * Math.sin(thetaMid) * p.diameter/2
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

  triangle: drawRegularPolygonParticle({ numPoints: 3 }),
  square: drawRegularPolygonParticle({ numPoints: 4 }),
  pentagon: drawRegularPolygonParticle({ numPoints: 5 }),
  hexagon: drawRegularPolygonParticle({ numPoints: 6 }),
  heptagon: drawRegularPolygonParticle({ numPoints: 7 }),
  octagon: drawRegularPolygonParticle({ numPoints: 8 }),

  diamond: drawRegularPolygonParticle({ numPoints: 4, spiked: true }),
  star: drawRegularPolygonParticle({ numPoints: 5, spiked: true }),
  hexagram: drawRegularPolygonParticle({ numPoints: 6, spiked: true }),
}
