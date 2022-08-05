import { useRef, useEffect } from 'react'
import { useControls, folder, button } from 'leva'
import {
  useConfetti,
  DEFAULT_SHAPE_FUNCTIONS,
  loadImage,
  drawImageParticle,
} from '@stevent-team/react-party'

const App = () => {
  // Setup controls
  const launch = useControls('Launch options', {
    duration: { value: 0, min: 0, max: 5000 },
    count: { value: 75, min: 1, max: 2000, step: 1 },
  })

  const global = useControls('Global options', {
    gravity: { value: 9.8, min: -50, max: 50, step: .1 },
    wind: { value: 0, min: -1, max: 1 },
    speed: { value: 1, min: 0, max: 10 },
    killDistance: { value: 100, min: 0, max: 3000, step: 10 },
  }, { collapsed: true })

  const confetti = useControls('Confetti options', {
    initialVelocity: [0, -3],
    initialVelocitySpread: [5, 7],
    diameter: { value: [10, 30], min: 0, max: 100 },
    twirl: { value: [0, .2], min: 0, max: 1 },
    angle: folder({
      initialAngle: { value: [0, 360], min: 0, max: 360 },
      angleIncrement: { value: [-10, 10], min: -50, max: 50 },
    }, { collapsed: true }),
    flip: folder({
      initialFlip: { value: [0, 360], min: 0, max: 360 },
      flipIncrement: { value: [-10, 10], min: -50, max: 50 },
    }, { collapsed: true }),
    rotationVelocityCoefficient: { value: .8, min: 0, max: 5 },
  }, { collapsed: true })

  const shapeWeights = useControls('Shape weights', {
    'line': { value: 0, min: 0, max: 5, step: 1 },
    'circle': { value: 1, min: 0, max: 5, step: 1 },
    'triangle': { value: 1, min: 0, max: 5, step: 1 },
    'square': { value: 1, min: 0, max: 5, step: 1 },
    'pentagon': { value: 0, min: 0, max: 5, step: 1 },
    'hexagon': { value: 0, min: 0, max: 5, step: 1 },
    'heptagon': { value: 0, min: 0, max: 5, step: 1 },
    'octagon': { value: 0, min: 0, max: 5, step: 1 },
    'diamond': { value: 0, min: 0, max: 5, step: 1 },
    'star': { value: 1, min: 0, max: 5, step: 1 },
    'hexagram': { value: 0, min: 0, max: 5, step: 1 },
    'image': { value: 0, min: 0, max: 5, step: 1 },
  }, { collapsed: true })

  useControls({
    'Visit the GitHub': button(() => window.open('https://github.com/stevent-team/react-party')),
  })

  // Load custom image
  const imageRef = useRef()
  useEffect(() => {
    loadImage("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Cpath fill='%23DD2E44' d='M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959.17-.721.268-1.469.268-2.242z'/%3E%3Cpath fill='%23FDCB58' d='M34.347 23.894l-3.824-1.416-1.416-3.824c-.145-.394-.52-.654-.938-.654-.418 0-.793.26-.938.653l-1.416 3.824-3.824 1.416c-.393.144-.653.519-.653.938 0 .418.261.793.653.938l3.824 1.416 1.416 3.824c.145.393.52.653.938.653.418 0 .793-.261.938-.653l1.416-3.824 3.824-1.416c.392-.145.653-.52.653-.938 0-.418-.261-.793-.653-.937zm-23-16.001l-2.365-.875-.875-2.365C7.961 4.26 7.587 4 7.169 4c-.419 0-.793.26-.938.653l-.876 2.365-2.364.875c-.393.146-.653.52-.653.938 0 .418.26.792.653.938l2.365.875.875 2.365c.146.393.52.653.938.653.418 0 .792-.26.938-.653l.875-2.365 2.365-.875c.393-.146.653-.519.653-.938 0-.418-.26-.792-.653-.938z'/%3E%3C/svg%3E")
      .then(img => imageRef.current = img)
  }, [])

  // Call hook
  const { createConfetti, canvasProps } = useConfetti({
    ...global,
    ...confetti,
    shapeWeights,

    shapeFunctions: {
      ...DEFAULT_SHAPE_FUNCTIONS,
      image: drawImageParticle(imageRef.current),
    }
  })

  return <>
    <canvas {...canvasProps} />
    <button onClick={() => createConfetti(launch)}>Party!</button>
  </>
}

export default App
