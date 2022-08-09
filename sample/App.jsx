import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Confetti from './Confetti'
import ShapeGrid from './ShapeGrid'

const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Confetti />} />
      <Route path='/shapes' element={<ShapeGrid />} />
    </Routes>
  </BrowserRouter>
}

export default App
