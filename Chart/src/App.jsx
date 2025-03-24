import { useState } from 'react'

import './App.css'

import Speedometer from '../component/Gauge'
import Dashboard from "../component/Resizable"
function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
            <Dashboard/>
      </div>
  )
}

export default App
