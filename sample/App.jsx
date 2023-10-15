import { HashRouter, Routes, Route } from 'react-router-dom'

import Confetti from './Confetti'
import ShapeGrid from './ShapeGrid'

const App = () => {
  return <HashRouter>
    <Routes>
      <Route path='/' element={<Confetti />} />
      <Route path='/shapes' element={<ShapeGrid />} />
    </Routes>
  </HashRouter>
}

export default App
