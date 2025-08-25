import './App.css'
import UnitCircle from './components/UnitCircle'
import AngleDisplayBox from './components/AngleDisplayBox'
import DarkModeButton from './components/DarkModeButton'
import { ThemeProvider } from './contexts/ThemeContext'
import { useState, useEffect } from 'react'

function AppContent() {
  const [isDegreesMode, setIsDegreesMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('unitCircleMode')
    return saved !== null ? saved === 'degrees' : true
  })
  const [selectedAngle, setSelectedAngle] = useState(0)
  const [isFromDragging, setIsFromDragging] = useState(false)

  useEffect(() => {
    localStorage.setItem('unitCircleMode', isDegreesMode ? 'degrees' : 'radians')
  }, [isDegreesMode])

  const handleAngleChange = (angle: number, fromDragging?: boolean) => {
    setSelectedAngle(angle)
    setIsFromDragging(fromDragging || false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-neutral-100 dark:bg-neutral-950 transition-colors duration-300">
      <div className="relative flex items-center justify-center">
        <UnitCircle 
          isDegreesMode={isDegreesMode} 
          onAngleChange={handleAngleChange}
          selectedAngle={selectedAngle}
        />
        <div className="absolute left-full ml-6">
          <AngleDisplayBox
            selectedAngle={selectedAngle}
            isDegreesMode={isDegreesMode}
            onAngleChange={handleAngleChange}
            isFromDragging={isFromDragging}
          />
        </div>
      </div>

      {/* Angle Mode Toggle */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Degrees</span>
        <button
          onClick={() => setIsDegreesMode(!isDegreesMode)}
          className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDegreesMode 
              ? 'bg-neutral-200 dark:bg-neutral-800' 
              : 'bg-blue-600 dark:bg-blue-500'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-200 bg-white dark:bg-gray-100 ${
              isDegreesMode ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Radians</span>
      </div>
      
      <DarkModeButton />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
