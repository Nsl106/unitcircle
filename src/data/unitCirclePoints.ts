export interface Point {
  angle: number;
  radians: string;
  x: string;
  y: string;
  tan: string;
  label: string;
}

// Define all the points on the unit circle
export const unitCirclePoints: Point[] = [
  // First quadrant (0° to 90°)
  { angle: 0, radians: '0', x: '1', y: '0', tan: '0', label: '0°' },
  { angle: 30, radians: '\\frac{\\pi}{6}', x: '\\frac{\\sqrt{3}}{2}', y: '\\frac{1}{2}', tan: '\\frac{1}{\\sqrt{3}}', label: '30°' },
  { angle: 45, radians: '\\frac{\\pi}{4}', x: '\\frac{\\sqrt{2}}{2}', y: '\\frac{\\sqrt{2}}{2}', tan: '1', label: '45°' },
  { angle: 60, radians: '\\frac{\\pi}{3}', x: '\\frac{1}{2}', y: '\\frac{\\sqrt{3}}{2}', tan: '\\sqrt{3}', label: '60°' },
  { angle: 90, radians: '\\frac{\\pi}{2}', x: '0', y: '1', tan: '\\text{undefined}', label: '90°' },

  // Second quadrant (90° to 180°)
  { angle: 120, radians: '\\frac{2\\pi}{3}', x: '-\\frac{1}{2}', y: '\\frac{\\sqrt{3}}{2}', tan: '-\\sqrt{3}', label: '120°' },
  { angle: 135, radians: '\\frac{3\\pi}{4}', x: '-\\frac{\\sqrt{2}}{2}', y: '\\frac{\\sqrt{2}}{2}', tan: '-1', label: '135°' },
  { angle: 150, radians: '\\frac{5\\pi}{6}', x: '-\\frac{\\sqrt{3}}{2}', y: '\\frac{1}{2}', tan: '-\\frac{1}{\\sqrt{3}}', label: '150°' },
  { angle: 180, radians: '\\pi', x: '-1', y: '0', tan: '0', label: '180°' },

  // Third quadrant (180° to 270°)
  { angle: 210, radians: '\\frac{7\\pi}{6}', x: '-\\frac{\\sqrt{3}}{2}', y: '-\\frac{1}{2}', tan: '\\frac{1}{\\sqrt{3}}', label: '210°' },
  { angle: 225, radians: '\\frac{5\\pi}{4}', x: '-\\frac{\\sqrt{2}}{2}', y: '-\\frac{\\sqrt{2}}{2}', tan: '1', label: '225°' },
  { angle: 240, radians: '\\frac{4\\pi}{3}', x: '-\\frac{1}{2}', y: '-\\frac{\\sqrt{3}}{2}', tan: '\\sqrt{3}', label: '240°' },
  { angle: 270, radians: '\\frac{3\\pi}{2}', x: '0', y: '-1', tan: '\\text{undefined}', label: '270°' },

  // Fourth quadrant (270° to 360°)
  { angle: 300, radians: '\\frac{5\\pi}{3}', x: '\\frac{1}{2}', y: '-\\frac{\\sqrt{3}}{2}', tan: '-\\sqrt{3}', label: '300°' },
  { angle: 315, radians: '\\frac{7\\pi}{4}', x: '\\frac{\\sqrt{2}}{2}', y: '-\\frac{\\sqrt{2}}{2}', tan: '-1', label: '315°' },
  { angle: 330, radians: '\\frac{11\\pi}{6}', x: '\\frac{\\sqrt{3}}{2}', y: '-\\frac{1}{2}', tan: '-\\frac{1}{\\sqrt{3}}', label: '330°' },
];

// Helper function to get snap points (just the angles)
export const getSnapPoints = (): number[] => {
  return unitCirclePoints.map(point => point.angle);
};

// Helper function to find a point by angle
export const findPointByAngle = (angle: number): Point | undefined => {
  return unitCirclePoints.find(point => point.angle === angle);
};

// Helper function to format angle display
export const formatAngleDisplay = (angle: number, isDegreesMode: boolean): string => {
  if (isDegreesMode) {
    return `${Math.round(angle)}°`;
  } else {
    // Try to find an exact match in the unit circle points
    const exactPoint = findPointByAngle(Math.round(angle));
    if (exactPoint) {
      return exactPoint.radians;
    }
    
    // If no exact match, format the radians
    const radians = (angle * Math.PI) / 180;
    return radians.toFixed(3);
  }
};
