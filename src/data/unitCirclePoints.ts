export interface Point {
  angle: number;
  x: string;
  y: string;
  tan: string;
  degreesLabel: string;
  radiansLabel: string;
}

// Define all the points on the unit circle
export const unitCirclePoints: Point[] = [
  // First quadrant (0° to 90°)
  { angle: 0, x: '1', y: '0', tan: '0', degreesLabel: '0°', radiansLabel: '0' },
  {
    angle: 30,
    x: '\\frac{\\sqrt{3}}{2}',
    y: '\\frac{1}{2}',
    tan: '\\frac{1}{\\sqrt{3}}',
    degreesLabel: '30°',
    radiansLabel: '\\frac{\\pi}{6}',
  },
  {
    angle: 45,
    x: '\\frac{\\sqrt{2}}{2}',
    y: '\\frac{\\sqrt{2}}{2}',
    tan: '1',
    degreesLabel: '45°',
    radiansLabel: '\\frac{\\pi}{4}',
  },
  {
    angle: 60,
    x: '\\frac{1}{2}',
    y: '\\frac{\\sqrt{3}}{2}',
    tan: '\\sqrt{3}',
    degreesLabel: '60°',
    radiansLabel: '\\frac{\\pi}{3}',
  },
  {
    angle: 90,
    x: '0',
    y: '1',
    tan: '\\text{undefined}',
    degreesLabel: '90°',
    radiansLabel: '\\frac{\\pi}{2}',
  },

  // Second quadrant (90° to 180°)
  {
    angle: 120,
    x: '-\\frac{1}{2}',
    y: '\\frac{\\sqrt{3}}{2}',
    tan: '-\\sqrt{3}',
    degreesLabel: '120°',
    radiansLabel: '\\frac{2\\pi}{3}',
  },
  {
    angle: 135,
    x: '-\\frac{\\sqrt{2}}{2}',
    y: '\\frac{\\sqrt{2}}{2}',
    tan: '-1',
    degreesLabel: '135°',
    radiansLabel: '\\frac{3\\pi}{4}',
  },
  {
    angle: 150,
    x: '-\\frac{\\sqrt{3}}{2}',
    y: '\\frac{1}{2}',
    tan: '-\\frac{1}{\\sqrt{3}}',
    degreesLabel: '150°',
    radiansLabel: '\\frac{5\\pi}{6}',
  },
  { angle: 180, x: '-1', y: '0', tan: '0', degreesLabel: '180°', radiansLabel: '\\pi' },

  // Third quadrant (180° to 270°)
  {
    angle: 210,
    x: '-\\frac{\\sqrt{3}}{2}',
    y: '-\\frac{1}{2}',
    tan: '\\frac{1}{\\sqrt{3}}',
    degreesLabel: '210°',
    radiansLabel: '\\frac{7\\pi}{6}',
  },
  {
    angle: 225,
    x: '-\\frac{\\sqrt{2}}{2}',
    y: '-\\frac{\\sqrt{2}}{2}',
    tan: '1',
    degreesLabel: '225°',
    radiansLabel: '\\frac{5\\pi}{4}',
  },
  {
    angle: 240,
    x: '-\\frac{1}{2}',
    y: '-\\frac{\\sqrt{3}}{2}',
    tan: '\\sqrt{3}',
    degreesLabel: '240°',
    radiansLabel: '\\frac{4\\pi}{3}',
  },
  {
    angle: 270,
    x: '0',
    y: '-1',
    tan: '\\text{undefined}',
    degreesLabel: '270°',
    radiansLabel: '\\frac{3\\pi}{2}',
  },

  // Fourth quadrant (270° to 360°)
  {
    angle: 300,
    x: '\\frac{1}{2}',
    y: '-\\frac{\\sqrt{3}}{2}',
    tan: '-\\sqrt{3}',
    degreesLabel: '300°',
    radiansLabel: '\\frac{5\\pi}{3}',
  },
  {
    angle: 315,
    x: '\\frac{\\sqrt{2}}{2}',
    y: '-\\frac{\\sqrt{2}}{2}',
    tan: '-1',
    degreesLabel: '315°',
    radiansLabel: '\\frac{7\\pi}{4}',
  },
  {
    angle: 330,
    x: '\\frac{\\sqrt{3}}{2}',
    y: '-\\frac{1}{2}',
    tan: '-\\frac{1}{\\sqrt{3}}',
    degreesLabel: '330°',
    radiansLabel: '\\frac{11\\pi}{6}',
  },
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
      return exactPoint.radiansLabel;
    }

    // If no exact match, format the radians
    const radians = (angle * Math.PI) / 180;
    return radians.toFixed(3);
  }
};
