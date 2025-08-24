import React, { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from '../contexts/ThemeContext';
import { unitCirclePoints, getSnapPoints } from '../data/unitCirclePoints';
interface UnitCircleProps {
  isDegreesMode: boolean;
  onAngleChange?: (angle: number, showSelector: boolean) => void;
}

const UnitCircle: React.FC<UnitCircleProps> = ({ isDegreesMode: degreesMode, onAngleChange }) => {
  const { colors } = useTheme();
  const radius = 250;
  const centerX = 350;
  const centerY = 350;

  // State for the draggable angle selector
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);



  // Offset constants
  const POINT_OFFSET = 0;
  const LABEL_OFFSET = 45;
  const INNER_LABEL_OFFSET = degreesMode ? -41 : -43;

  // Generalized function to get a position on the circle with a given offset
  const getCirclePosition = (angle: number, offset: number) => {
    const radian = (angle * Math.PI) / 180;
    const x = centerX + (radius + offset) * Math.cos(radian);
    const y = centerY - (radius + offset) * Math.sin(radian); // SVG y-axis is inverted
    return { x, y };
  };

  // Function to calculate angle from mouse position
  const getAngleFromMouse = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Calculate angle from center
    const deltaX = x - centerX;
    const deltaY = centerY - y; // Invert Y axis

    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    // Convert to 0-360 range
    if (angle < 0) {
      angle += 360;
    }

    return angle;
  };

  // Function to calculate distance from center
  const getDistanceFromCenter = (clientX: number, clientY: number) => {
    if (!svgRef.current) return Infinity;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
  };

  // Function to snap angle to specific values
  const snapToAngle = (angle: number, ctrlPressed: boolean) => {
    if (ctrlPressed) return angle; // Skip snapping if Ctrl is held

    const snapPoints = getSnapPoints();
    const snapThreshold = 15; // degrees

    // Find the closest snap point
    let closestSnap = angle;
    let minDistance = 2;

    for (const snapPoint of snapPoints) {
      const distance = Math.min(
        Math.abs(angle - snapPoint),
        Math.abs(angle - snapPoint + 360),
        Math.abs(angle - snapPoint - 360)
      );
      
      if (distance < minDistance && distance <= snapThreshold) {
        minDistance = distance;
        closestSnap = snapPoint;
      }
    }

    return closestSnap;
  };

  // Notify parent component when angle changes
  useEffect(() => {
    if (onAngleChange) {
      onAngleChange(selectedAngle, showSelector);
    }
  }, [selectedAngle, showSelector, onAngleChange]);

  // Add global mouse up listener and ESC key listener
  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      const distanceFromCenter = getDistanceFromCenter(e.clientX, e.clientY);

      // If clicking within the unit circle, start dragging
      if (distanceFromCenter <= radius + 100) {
        setIsDragging(true);
        setShowSelector(true);
        const angle = getAngleFromMouse(e.clientX, e.clientY);
        const snappedAngle = snapToAngle(angle, ctrlPressed);
        setSelectedAngle(snappedAngle);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const angle = getAngleFromMouse(e.clientX, e.clientY);
        const snappedAngle = snapToAngle(angle, ctrlPressed);
        setSelectedAngle(snappedAngle);
      }

      // Update cursor based on distance from center
      const distanceFromCenter = getDistanceFromCenter(e.clientX, e.clientY);

      if (distanceFromCenter <= radius + 100) {
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSelector(false);
        setIsDragging(false);
      }
      if (e.key === 'Control') {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setCtrlPressed(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalMouseDown);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
      }, [isDragging, ctrlPressed]);

  const selectedPos = getCirclePosition(selectedAngle, 0);

  return (
    <div className="flex justify-center items-center p-8 gap-8" style={{ backgroundColor: colors.background }}>
      <svg
        ref={svgRef}
        width="700"
        height="700"
        viewBox="0 0 700 700"
        className="border border-white"
      >

        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={colors.circleStroke}
          strokeWidth="2"
        />

        {/* Radial lines and points */}
        {unitCirclePoints.map((point, index) => {
          const pos = getCirclePosition(point.angle, POINT_OFFSET);
          const labelPos = getCirclePosition(point.angle, LABEL_OFFSET);
          const innerLabelPos = getCirclePosition(point.angle, INNER_LABEL_OFFSET);

          const isAxis = point.angle == 0 || point.angle == 90 || point.angle == 180 || point.angle == 270

          return (
            <g key={index}>
              {/* Radial line with gap */}
              <line
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={isAxis ? colors.radialLineAxis : colors.radialLine}
                strokeWidth={isAxis ? 2 : 1}
                opacity={isAxis ? 1 : 0.6}
              />

              <circle
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill={colors.point}
              />

              <foreignObject
                x={innerLabelPos.x - 35}
                y={innerLabelPos.y - (degreesMode ? 12 : 15)}
                width="70"
                height="40"
              >
                <div className={'flex flex-col justify-center items-center text-center ' + (degreesMode ? 'text-sm' : 'text-xl')} style={{ color: colors.text }}>
                  <div className='size-min outline-4 outline-offset-0 outline-solid' style={{ backgroundColor: colors.background, outlineColor: colors.background, userSelect: 'none' }}>
                    <InlineMath math={degreesMode ? point.label : point.radians} />
                  </div>
                </div>
              </foreignObject>

              <foreignObject
                x={labelPos.x - 60}
                y={labelPos.y - 15}
                width="120"
                height="40"
              >
                <div className='text-lg text-center' style={{ color: colors.text, userSelect: 'none' }}>
                  (<InlineMath math={point.x} />, <InlineMath math={point.y} />)
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Selected angle indicator */}
        {showSelector && (
          <g>
            {/* Tan line - from point to x-axis (tangent line) - rendered first to be behind */}
            <line
              x1={selectedPos.x}
              y1={selectedPos.y}
              x2={centerX + radius}
              y2={centerY - (radius * Math.tan((selectedAngle * Math.PI) / 180))}
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Sin line (vertical) - from x-axis to point */}
            <line
              x1={selectedPos.x}
              y1={centerY}
              x2={selectedPos.x}
              y2={selectedPos.y}
              stroke="#ff0000"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Cos line (horizontal) - from y-axis to point */}
            <line
              x1={centerX}
              y1={selectedPos.y}
              x2={selectedPos.x}
              y2={selectedPos.y}
              stroke="#00ff00"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Tan vertical line - from tangent point to x-axis */}
            <line
              x1={centerX + radius}
              y1={centerY - (radius * Math.tan((selectedAngle * Math.PI) / 180))}
              x2={centerX + radius}
              y2={centerY}
              stroke="#0000ff"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Line from center to selected point */}
            <line
              x1={centerX}
              y1={centerY}
              x2={selectedPos.x}
              y2={selectedPos.y}
              stroke="#ff6b6b"
              strokeWidth="3"
              opacity="0.8"
            />

            {/* Selected point */}
            <circle
              cx={selectedPos.x}
              cy={selectedPos.y}
              r="8"
              fill="#ff6b6b"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default UnitCircle; 
