import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from '../contexts/ThemeContext';
import { formatAngleDisplay, findPointByAngle } from '../data/unitCirclePoints';
import * as math from 'mathjs';

interface AngleDisplayBoxProps {
  selectedAngle: number;
  isDegreesMode: boolean;
  onAngleChange?: (angle: number) => void;
  isFromDragging?: boolean; // New prop to track if angle change came from dragging
}

const AngleDisplayBox: React.FC<AngleDisplayBoxProps> = ({ 
  selectedAngle, 
  isDegreesMode,
  onAngleChange,
  isFromDragging = false
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userTypedValue, setUserTypedValue] = useState(''); // Track user's typed value

  // Function to get display value for editing (without LaTeX formatting)
  const getDisplayValueForEditing = (angle: number, isDegreesMode: boolean): string => {
    if (isDegreesMode) {
      // For degrees, just show the number
      return Math.round(angle).toString();
    } else {
      // For radians, try to find an exact match and show the mathematical expression
      const exactPoint = findPointByAngle(Math.round(angle));
      if (exactPoint) {
        // Convert LaTeX to readable math expressions
        const radiansLabel = exactPoint.radiansLabel;
        return radiansLabel
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
          .replace(/\\pi/g, 'pi')
          .replace(/\\text\{undefined\}/g, 'undefined');
      }
      
      // If no exact match, show the decimal value
      const radians = (angle * Math.PI) / 180;
      return radians.toFixed(3);
    }
  };

  // Update input value when selectedAngle changes from external source (dragging)
  useEffect(() => {
    if (isFromDragging && !isEditing) {
      // Only update if the change came from dragging and we're not currently editing
      const newValue = getDisplayValueForEditing(selectedAngle, isDegreesMode);
      setInputValue(newValue);
      setUserTypedValue(newValue);
    }
  }, [selectedAngle, isDegreesMode, isEditing, isFromDragging]);

  // Try to find the exact point in unit circle data, otherwise calculate coordinates
  const exactPoint = findPointByAngle(Math.round(selectedAngle));
  const selectedAngleRadians = (selectedAngle * Math.PI) / 180;
  const selectedX = exactPoint ? exactPoint.x : Math.cos(selectedAngleRadians).toFixed(3);
  const selectedY = exactPoint ? exactPoint.y : Math.sin(selectedAngleRadians).toFixed(3);
  const selectedTan = exactPoint ? exactPoint.tan : Math.tan(selectedAngleRadians).toFixed(3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setUserTypedValue(newValue);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    try {
      // Parse the input value using mathjs
      let parsedValue: number;
      
      if (isDegreesMode) {
        // For degrees mode, try to parse as degrees
        parsedValue = math.evaluate(inputValue);
        // Ensure it's a valid angle
        parsedValue = parsedValue % 360;
        if (parsedValue < 0) parsedValue += 360;
      } else {
        // For radians mode, parse as radians and convert to degrees
        parsedValue = math.evaluate(inputValue);
        parsedValue = (parsedValue * 180) / Math.PI;
        // Ensure it's a valid angle
        parsedValue = parsedValue % 360;
        if (parsedValue < 0) parsedValue += 360;
      }

      if (onAngleChange && !isNaN(parsedValue)) {
        onAngleChange(parsedValue);
      }
    } catch (error) {
      // If parsing fails the input stays as the user typed it
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      // Revert to the user's typed value, not the calculated value
      setInputValue(userTypedValue);
    }
  };

  const handleAngleClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-white min-w-52 min-h-52">
      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Selected Angle</h3>
      
      {isEditing ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="text-2xl font-bold mb-2 text-center bg-transparent border-b-2 border-white outline-none"
            style={{ color: '#ff6b6b' }}
            autoFocus
            placeholder={isDegreesMode ? "45, 90, 180" : "pi/4, pi/2, pi"}
          />
          <div className="text-xs text-gray-500 mt-1 text-center">
            {isDegreesMode ? "Examples: 45, 90, 180" : "Examples: pi/4, pi/2, pi"}
          </div>
        </div>
      ) : (
        <div 
          className="text-2xl font-bold mb-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-10 px-2 py-1 rounded"
          style={{ color: '#ff6b6b' }}
          onClick={handleAngleClick}
          title="Click to edit"
        >
          <InlineMath math={formatAngleDisplay(selectedAngle, isDegreesMode)} />
        </div>
      )}
      
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
