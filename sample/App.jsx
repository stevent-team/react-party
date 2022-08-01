import { useControls, folder } from 'leva'
import { useConfetti } from '@stevent-team/react-party'

const App = () => {
  // Setup controls
  const showConfettiOptions = useControls('ShowConfettiOptions', {
    duration: { value: 0, min: 0, max: 2000 },
    count: { value: 75, min: 0, max: 3000 },
  })
  const confettiOptions = useControls('Confetti Options', {
    gravity: { value: 1.3, min: -5, max: 5 },
    simulationSpeed: { value: 1.5, min: 0, max: 20 },
    tiltAmount: { value: 15, min: -15, max: 30 },
    killDistance: { value: 100, min: 0, max: 3000 },
    xVelocity: folder({
      xVelocityBase: { value: 0, min: -10, max: 10 },
      xVelocityVariance: { value: 1.5, min: -10, max: 10 },
    }, { collapsed: true }),
    yVelocity: folder({
      yVelocityBase: { value: -1, min: -10 , max: 10 },
      yVelocityVariance: { value: 3, min: -10 , max: 10 },
    }, { collapsed: true }),
    diameter: folder({
      diameterBase: { value: 5, min: 0, max: 30 },
      diameterVariance: { value: 10, min: -5, max: 30 },
    }, { collapsed: true }),
    tilt: folder({
      tiltBase: { value: -10, min: -30, max: 30 },
      tiltVariance: { value: 10, min: -30, max: 30 },
    }, { collapsed: true }),
    tiltAngle: folder({
      tiltAngleBase: { value: 0, min: -30 , max: 30 },
      tiltAngleVariance: { value: 6.28, min: 0, max: 15 },
    }, { collapsed: true }),
    tiltAngleIncrement: folder({
      tiltAngleIncrementBase: { value: 0.05, min: 0, max: 1 },
      tiltAngleIncrementVariance: { value: 0.07, min: 0, max: 1 },
    }, { collapsed: true }),
  })
  const shapeWeights = useControls('Shape Weights', {
    'line': { value: 1, min: 0, max: 5, step: 1 },
    'circle': { value: 1, min: 0, max: 5, step: 1 },
    'triangle': { value: 2, min: 0, max: 5, step: 1 },
    'pentagon': { value: 0, min: 0, max: 5, step: 1 },
    'hexagon': { value: 0, min: 0, max: 5, step: 1 },
    'heptagon': { value: 0, min: 0, max: 5, step: 1 },
    'octagon': { value: 0, min: 0, max: 5, step: 1 },
    'star': { value: 1, min: 0, max: 5, step: 1 },
  }, { collapsed: true })

  // Call hook
  const { showConfetti, Confetti } = useConfetti({
    ...confettiOptions,
    shapeWeights
  })

  return <>
    <Confetti />
    <button onClick={() => showConfetti(showConfettiOptions)}>Click me!</button>
  </>
}

export default App
