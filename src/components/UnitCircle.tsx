import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from '../contexts/ThemeContext';

interface Point {
  angle: number;
  radians: string;
  x: string;
  y: string;
  label: string;
}

interface UnitCircleProps {
  isDegreesMode: Boolean;
}

const UnitCircle: React.FC<UnitCircleProps> = ({ isDegreesMode: degreesMode }) => {
  const { colors } = useTheme();
  const radius = 250;
  const centerX = 350;
  const centerY = 350;

  // Define all the points on the unit circle
  const points: Point[] = [
    // First quadrant (0° to 90°)
    { angle: 0, radians: '0', x: '1', y: '0', label: '0°' },
    { angle: 30, radians: '\\frac{\\pi}{6}', x: '\\frac{\\sqrt{3}}{2}', y: '\\frac{1}{2}', label: '30°' },
    { angle: 45, radians: '\\frac{\\pi}{4}', x: '\\frac{\\sqrt{2}}{2}', y: '\\frac{\\sqrt{2}}{2}', label: '45°' },
    { angle: 60, radians: '\\frac{\\pi}{3}', x: '\\frac{1}{2}', y: '\\frac{\\sqrt{3}}{2}', label: '60°' },
    { angle: 90, radians: '\\frac{\\pi}{2}', x: '0', y: '1', label: '90°' },

    // Second quadrant (90° to 180°)
    { angle: 120, radians: '\\frac{2\\pi}{3}', x: '-\\frac{1}{2}', y: '\\frac{\\sqrt{3}}{2}', label: '120°' },
    { angle: 135, radians: '\\frac{3\\pi}{4}', x: '-\\frac{\\sqrt{2}}{2}', y: '\\frac{\\sqrt{2}}{2}', label: '135°' },
    { angle: 150, radians: '\\frac{5\\pi}{6}', x: '-\\frac{\\sqrt{3}}{2}', y: '\\frac{1}{2}', label: '150°' },
    { angle: 180, radians: '\\pi', x: '-1', y: '0', label: '180°' },

    // Third quadrant (180° to 270°)
    { angle: 210, radians: '\\frac{7\\pi}{6}', x: '-\\frac{\\sqrt{3}}{2}', y: '-\\frac{1}{2}', label: '210°' },
    { angle: 225, radians: '\\frac{5\\pi}{4}', x: '-\\frac{\\sqrt{2}}{2}', y: '-\\frac{\\sqrt{2}}{2}', label: '225°' },
    { angle: 240, radians: '\\frac{4\\pi}{3}', x: '-\\frac{1}{2}', y: '-\\frac{\\sqrt{3}}{2}', label: '240°' },
    { angle: 270, radians: '\\frac{3\\pi}{2}', x: '0', y: '-1', label: '270°' },

    // Fourth quadrant (270° to 360°)
    { angle: 300, radians: '\\frac{5\\pi}{3}', x: '\\frac{1}{2}', y: '-\\frac{\\sqrt{3}}{2}', label: '300°' },
    { angle: 315, radians: '\\frac{7\\pi}{4}', x: '\\frac{\\sqrt{2}}{2}', y: '-\\frac{\\sqrt{2}}{2}', label: '315°' },
    { angle: 330, radians: '\\frac{11\\pi}{6}', x: '\\frac{\\sqrt{3}}{2}', y: '-\\frac{1}{2}', label: '330°' },
  ];

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

  return (
    <div className="flex justify-center items-center p-8" style={{ backgroundColor: colors.background }}>
      <svg 
        width="700" 
        height="700" 
        viewBox="0 0 700 700" 
        className="border"
        style={{ 
          borderColor: colors.border, 
          backgroundColor: colors.background 
        }}
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
        {points.map((point, index) => {
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
                  <div className='size-min outline-4 outline-offset-0 outline-solid' style={{ backgroundColor: colors.background, outlineColor: colors.background }}>
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
                <div className='text-lg text-center' style={{ color: colors.text }}>
                  (<InlineMath math={point.x} />, <InlineMath math={point.y} />)
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default UnitCircle; 
