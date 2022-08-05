import { forwardRef } from 'react'

const Canvas = forwardRef(({ style, ...props }, ref) => (
  <canvas
    ref={ref}
    style={{
      display: 'block',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      width: '100%',
      height: '100%',
      ...style,
    }}
    {...props}
  />
))

export default Canvas
