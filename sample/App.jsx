import { useRef } from 'react'
import { useConfetti } from '@stevent-team/react-party'

const App = () => {
  const { showConfetti, Confetti } = useConfetti()

  return <>
    <Confetti />
    <button onClick={showConfetti}>Click me!</button>
  </>
}

export default App
