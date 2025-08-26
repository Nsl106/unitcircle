import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Button } from './ui/button';
import {Sun, Moon, Github} from 'lucide-react';

const CornerButtons: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
      <div className={"flex flex-row gap-4 fixed bottom-4 right-4"}>
        <Button
            onClick={()=> window.open("https://github.com/Nsl106/unitcircle", "_blank")}
            variant={'ghost'}
            size={'icon'}
            className="rounded-full cursor-pointer"
        >
          <Github className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button
            onClick={() => (theme == 'light' ? setTheme('dark') : setTheme('light'))}
            variant={'ghost'}
            size={'icon'}
            className="rounded-full cursor-pointer"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
  );
};

export default CornerButtons;
