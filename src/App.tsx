import './App.css'
import UnitCircle from './components/UnitCircle'
import DarkModeButton from './components/DarkModeButton'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { useState } from 'react'

function AppContent() {
  const [isDegreesMode, setIsDegreesMode] = useState<Boolean>(true)
  const { colors } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4" style={{ backgroundColor: colors.background }}>
      <UnitCircle isDegreesMode={isDegreesMode} />

      {/* Angle Mode Toggle */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Degrees</span>
        <button
          onClick={() => setIsDegreesMode(!isDegreesMode)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: isDegreesMode ? colors.toggleBg : colors.toggleActive,
          }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full transition-transform"
            style={{
              backgroundColor: colors.toggleKnob,
              transform: isDegreesMode ? 'translateX(4px)' : 'translateX(24px)',
            }}
          />
        </button>
        <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Radians</span>
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
