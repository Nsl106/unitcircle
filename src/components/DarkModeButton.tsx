import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';

const DarkModeButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => theme == "light" ? setTheme("dark") : setTheme("light")}
      variant={"ghost"}
      size={"icon"}
      className="fixed bottom-4 right-4 rounded-full cursor-pointer"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkModeButton;
