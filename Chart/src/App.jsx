import { useState } from 'react'

import './App.css'

import Speedometer from '../component/Gauge'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
           <Speedometer/>
      </div>
  )
}

export default App
