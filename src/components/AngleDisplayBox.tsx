import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from '../contexts/ThemeContext';
import { formatAngleDisplay, findPointByAngle } from '../data/unitCirclePoints';

interface AngleDisplayBoxProps {
  selectedAngle: number;
  isDegreesMode: boolean;
}

const AngleDisplayBox: React.FC<AngleDisplayBoxProps> = ({ 
  selectedAngle, 
  isDegreesMode 
}) => {
  const { colors } = useTheme();

  // Try to find the exact point in unit circle data, otherwise calculate coordinates
  const exactPoint = findPointByAngle(Math.round(selectedAngle));
  const selectedAngleRadians = (selectedAngle * Math.PI) / 180;
  const selectedX = exactPoint ? exactPoint.x : Math.cos(selectedAngleRadians).toFixed(3);
  const selectedY = exactPoint ? exactPoint.y : Math.sin(selectedAngleRadians).toFixed(3);
  const selectedTan = exactPoint ? exactPoint.tan : Math.tan(selectedAngleRadians).toFixed(3);



  return (
    <div className="flex flex-col items-center justify-center p-6 border border-white min-w-52 min-h-52">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Selected Angle</h3>
      <div className="text-2xl font-bold mb-2" style={{ color: '#ff6b6b' }}>
        <InlineMath math={formatAngleDisplay(selectedAngle, isDegreesMode)} />
      </div>
      <div className="text-sm text-gray-600 mb-2">Coordinates:</div>
      <div className="text-lg" style={{ color: '#ff6b6b' }}>
        (<InlineMath math={selectedX} />, <InlineMath math={selectedY} />)
      </div>
      <div className="text-sm text-gray-600 mb-2 mt-4">Trigonometric Functions:</div>
      <div className="text-sm space-y-1">
        <div style={{ color: '#ff0000' }}>
          sin = <InlineMath math={selectedY} />
        </div>
        <div style={{ color: '#00ff00' }}>
          cos = <InlineMath math={selectedX} />
        </div>
        <div style={{ color: '#0000ff' }}>
          tan = <InlineMath math={selectedTan} />
        </div>
      </div>
    </div>
  );
};

export default AngleDisplayBox;
