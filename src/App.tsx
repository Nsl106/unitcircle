import UnitCircle from './components/UnitCircle'
import AngleDisplayBox from './components/AngleDisplayBox'
import DarkModeButton from './components/DarkModeButton'
import { ThemeProvider } from './contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { Switch } from './components/ui/switch'

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
        <Switch onClick={() => setIsDegreesMode(!isDegreesMode)}/>
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
