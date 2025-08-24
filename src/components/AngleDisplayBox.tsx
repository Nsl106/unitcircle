import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from '../contexts/ThemeContext';

interface AngleDisplayBoxProps {
  selectedAngle: number;
  isDegreesMode: boolean;
}

const AngleDisplayBox: React.FC<AngleDisplayBoxProps> = ({ 
  selectedAngle, 
  isDegreesMode 
}) => {
  const { colors } = useTheme();

  // Calculate coordinates for the selected angle
  const selectedAngleRadians = (selectedAngle * Math.PI) / 180;
  const selectedX = Math.cos(selectedAngleRadians);
  const selectedY = Math.sin(selectedAngleRadians);

  // Format the selected angle display
  const formatSelectedAngle = () => {
    if (isDegreesMode) {
      return `${Math.round(selectedAngle)}°`;
    } else {
      const radians = (selectedAngle * Math.PI) / 180;
      if (radians === 0) return '0';
      if (radians === Math.PI) return '\\pi';
      if (radians === Math.PI / 2) return '\\frac{\\pi}{2}';
      if (radians === 3 * Math.PI / 2) return '\\frac{3\\pi}{2}';
      if (radians === Math.PI / 4) return '\\frac{\\pi}{4}';
      if (radians === 3 * Math.PI / 4) return '\\frac{3\\pi}{4}';
      if (radians === 5 * Math.PI / 4) return '\\frac{5\\pi}{4}';
      if (radians === 7 * Math.PI / 4) return '\\frac{7\\pi}{4}';
      if (radians === Math.PI / 6) return '\\frac{\\pi}{6}';
      if (radians === 5 * Math.PI / 6) return '\\frac{5\\pi}{6}';
      if (radians === 7 * Math.PI / 6) return '\\frac{7\\pi}{6}';
      if (radians === 11 * Math.PI / 6) return '\\frac{11\\pi}{6}';
      if (radians === Math.PI / 3) return '\\frac{\\pi}{3}';
      if (radians === 2 * Math.PI / 3) return '\\frac{2\\pi}{3}';
      if (radians === 4 * Math.PI / 3) return '\\frac{4\\pi}{3}';
      if (radians === 5 * Math.PI / 3) return '\\frac{5\\pi}{3}';
      return radians.toFixed(3);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-white min-w-52 min-h-52">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Selected Angle</h3>
      <div className="text-2xl font-bold mb-2" style={{ color: '#ff6b6b' }}>
        <InlineMath math={formatSelectedAngle()} />
      </div>
      <div className="text-sm text-gray-600 mb-2">Coordinates:</div>
      <div className="text-lg" style={{ color: '#ff6b6b' }}>
        (<InlineMath math={selectedX.toFixed(3)} />, <InlineMath math={selectedY.toFixed(3)} />)
      </div>
    </div>
  );
};

export default AngleDisplayBox;
