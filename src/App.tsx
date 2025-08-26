import UnitCircle from './components/UnitCircle';
import AngleDisplayBox from './components/AngleDisplayBox';
import CornerButtons from './components/CornerButtons.tsx';
import { ThemeProvider } from './contexts/ThemeProvider';
import { useState, useEffect } from 'react';
import { Switch } from './components/ui/switch';
import { cn } from '@/lib/utils.ts';

function AppContent() {
  const [isDegreesMode, setIsDegreesMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('unitCircleMode');
    return saved !== null ? saved === 'degrees' : true;
  });
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [isFromDragging, setIsFromDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('unitCircleMode', isDegreesMode ? 'degrees' : 'radians');
  }, [isDegreesMode]);

  const handleAngleChange = (angle: number, fromDragging?: boolean) => {
    setSelectedAngle(angle);
    setIsFromDragging(fromDragging || false);
  };

  return (
    <div
      className={cn(
        'flex flex-wrap flex-row items-center justify-center',
        'min-h-screen min-w-screen',
        'md:gap-5',
        'bg-neutral-100 dark:bg-neutral-950 transition-colors duration-300'
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <UnitCircle
          className={'w-screen max-h-screen max-w-96 aspect-square md:w-128 md:max-w-128 mb-2'}
          isDegreesMode={isDegreesMode}
          onAngleChange={handleAngleChange}
          selectedAngle={selectedAngle}
        />

        <div className="flex items-center gap-3 m-2">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Degrees
          </span>
          <Switch checked={!isDegreesMode} onClick={() => setIsDegreesMode(!isDegreesMode)} />
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Radians
          </span>
        </div>
      </div>

      <div className="m-2">
        <AngleDisplayBox
          selectedAngle={selectedAngle}
          isDegreesMode={isDegreesMode}
          onAngleChange={handleAngleChange}
          isFromDragging={isFromDragging}
        />
      </div>

      <CornerButtons />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
