import './App.css'
import UnitCircle from './components/UnitCircle'
import { useState } from 'react'

function App() {
  const [isDegreesMode, setIsDegreesMode] = useState<Boolean>(true)

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Unit Circle</h1>
      <UnitCircle isDegreesMode={isDegreesMode} />

      {/* Angle Mode Toggle */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-gray-700">Degrees</span>
        <button
          onClick={() => setIsDegreesMode(!isDegreesMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDegreesMode ? 'bg-gray-200' : 'bg-blue-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDegreesMode ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-700">Radians</span>
      </div>
          </div>
  )
}

export default App
