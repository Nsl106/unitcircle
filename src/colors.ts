export const colors = {
  light: {
    background: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#d1d5db',
    circle: '#000000',
    circleStroke: '#000000',
    radialLine: '#000000',
    radialLineAxis: '#000000',
    point: '#000000',
    toggleBg: '#e5e7eb',
    toggleActive: '#2563eb',
    toggleKnob: '#ffffff',
  },
  dark: {
    background: '#0f0f0f',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#2a2a2a',
    circle: '#ffffff',
    circleStroke: '#ffffff',
    radialLine: '#ffffff',
    radialLineAxis: '#ffffff',
    point: '#ffffff',
    toggleBg: '#2a2a2a',
    toggleActive: '#ffffff',
    toggleKnob: '#0f0f0f',
  },
} as const;

export type Theme = 'light' | 'dark';
