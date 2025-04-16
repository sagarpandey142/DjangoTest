import { useState } from 'react'

import './App.css'


import Dashboard from "../component/Testing"
function App() {
  const [count, setCount] = useState(0)

  return (
      <div id='mainp' className=' overflow-x-hidden'>
            <Dashboard/>
      </div>
  )
}

export default App
