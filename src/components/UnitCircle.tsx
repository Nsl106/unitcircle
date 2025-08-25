import React, { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { getSnapPoints, unitCirclePoints } from '../data/unitCirclePoints';
import { cn } from '@/lib/utils.ts';

interface ResponsiveUnitCircleProps {
  className?: string;
  isDegreesMode: boolean;
  onAngleChange?: (angle: number, showSelector: boolean, isFromDragging: boolean) => void;
  selectedAngle?: number;
}

const UnitCircle: React.FC<ResponsiveUnitCircleProps> = ({
  className,
  isDegreesMode,
  onAngleChange,
  selectedAngle: externalSelectedAngle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState(300);

  // State for the draggable angle selector
  const [internalSelectedAngle, setInternalSelectedAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  // Use external angle if provided, otherwise use internal state
  const selectedAngle =
    externalSelectedAngle !== undefined ? externalSelectedAngle : internalSelectedAngle;

  // Calculate responsive dimensions
  const calculateDimensions = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate the maximum size that fits in the container
    const maxSize = Math.min(containerWidth, containerHeight, 700);

    setSize(maxSize);
  };

  // Handle resize
  useEffect(() => {
    calculateDimensions();

    // Check if ResizeObserver is available
    if (typeof ResizeObserver !== 'undefined') {
      try {
        const resizeObserver = new ResizeObserver(() => {
          calculateDimensions();
        });

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        return () => {
          resizeObserver.disconnect();
        };
      } catch (error) {
        // Fallback if ResizeObserver fails
        console.warn('ResizeObserver not available');
      }
    }
  }, []);

  // Update internal state when external angle changes
  useEffect(() => {
    if (externalSelectedAngle !== undefined) {
      setInternalSelectedAngle(externalSelectedAngle);
      setShowSelector(true);
    }
  }, [externalSelectedAngle]);

  // Calculate responsive values
  const radius = size * 0.32;
  const centerX = size / 2;
  const centerY = size / 2;

  // Offset constants (scaled with size)
  const scale = size / 700.0; // Scale factor based on original 700px design
  const POINT_OFFSET = 0;
  const LABEL_OFFSET = 65 * scale;
  const INNER_LABEL_OFFSET = -50 * scale;

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
    if (!rect) return 0;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Calculate angle from center
    const deltaX = x - centerX;
    const deltaY = centerY - y; // Invert Y axis

    let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

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
    if (!rect) return Infinity;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  };

  // Function to snap angle to specific values
  const snapToAngle = (angle: number, ctrlPressed: boolean) => {
    if (ctrlPressed) return angle; // Skip snapping if Ctrl is held

    const snapPoints = getSnapPoints();

    // Find the closest snap point
    let closestSnap = angle;
    let minDistance = 3;

    for (const snapPoint of snapPoints) {
      const distance = Math.min(
        Math.abs(angle - snapPoint),
        Math.abs(angle - snapPoint + 360),
        Math.abs(angle - snapPoint - 360)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = snapPoint;
      }
    }

    return closestSnap;
  };

  // Notify parent component when angle changes (only for internal changes)
  useEffect(() => {
    if (onAngleChange && externalSelectedAngle === undefined) {
      onAngleChange(selectedAngle, showSelector, false);
    }
  }, [selectedAngle, showSelector, onAngleChange, externalSelectedAngle]);

  useEffect(() => {
    // Function to update angle and notify parent
    const updateAngle = (
      newAngle: number,
      showSelectorState: boolean = true,
      isFromDragging: boolean = false
    ) => {
      setInternalSelectedAngle(newAngle);
      setShowSelector(showSelectorState);
      if (onAngleChange) {
        onAngleChange(newAngle, showSelectorState, isFromDragging);
      }
    };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      const distanceFromCenter = getDistanceFromCenter(e.clientX, e.clientY);

      // If clicking within the unit circle, start dragging
      if (distanceFromCenter <= radius + 100 * scale) {
        setIsDragging(true);
        setShowSelector(true);
        const angle = getAngleFromMouse(e.clientX, e.clientY);
        const snappedAngle = snapToAngle(angle, ctrlPressed);
        updateAngle(snappedAngle, true, true);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const angle = getAngleFromMouse(e.clientX, e.clientY);
        const snappedAngle = snapToAngle(angle, ctrlPressed);
        updateAngle(snappedAngle, true, true);
      }

      // Update cursor based on distance from center
      const distanceFromCenter = getDistanceFromCenter(e.clientX, e.clientY);

      if (distanceFromCenter <= radius + 100 * scale) {
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isDragging, ctrlPressed, radius, centerX, centerY]);

  const selectedPos = getCirclePosition(selectedAngle, 0);

  // Render HTML overlay labels absolutely positioned over the SVG
  const renderHtmlOverlay = () => {
    return (
      <div className="z-5 absolute inset-0 pointer-events-none" aria-hidden="true">
        {unitCirclePoints.map((point, index) => {
          const labelPos = getCirclePosition(point.angle, LABEL_OFFSET);
          const innerLabelPos = getCirclePosition(point.angle, INNER_LABEL_OFFSET);

          const innerFontSize = isDegreesMode ? 22 * scale : 26 * scale;
          const outerFontSize = 26 * scale;

          return (
            <React.Fragment key={`overlay-${index}`}>
              <div
                className="flex flex-col justify-center items-center text-center text-neutral-950 dark:text-neutral-100"
                style={{
                  position: 'absolute',
                  left: `${innerLabelPos.x}px`,
                  top: `${innerLabelPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${innerFontSize}px`,
                  userSelect: 'none',
                }}
              >
                <span className="bg-neutral-100 dark:bg-neutral-950 px-1 py-1 rounded-full transition-colors duration-300">
                  <InlineMath math={isDegreesMode ? point.degreesLabel : point.radiansLabel} />
                </span>
              </div>

              <div
                className="text-center text-neutral-950 dark:text-neutral-100 truncate"
                style={{
                  position: 'absolute',
                  left: `${labelPos.x}px`,
                  top: `${labelPos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${outerFontSize}px`,
                  userSelect: 'none',
                }}
              >
                (<InlineMath math={point.x} />,<InlineMath math={point.y} />)
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 transition-colors duration-300',
        className
      )}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {renderHtmlOverlay()}
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute border border-neutral-950 dark:border-neutral-100"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-neutral-950 dark:text-neutral-100"
            strokeWidth="2"
          />

          {/* Radial lines and points */}
          {unitCirclePoints.map((point, index) => {
            const pos = getCirclePosition(point.angle, POINT_OFFSET);

            const isAxis =
              point.angle == 0 || point.angle == 90 || point.angle == 180 || point.angle == 270;

            return (
              <g key={index}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  className={
                    isAxis
                      ? 'text-neutral-950 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-600'
                  }
                  strokeWidth={isAxis ? 2 * scale : 1 * scale}
                />

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={4 * scale}
                  fill="currentColor"
                  className="text-neutral-950 dark:text-neutral-100"
                />
              </g>
            );
          })}
        </svg>
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute z-10 border border-neutral-950 dark:border-neutral-100"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          {/* Selected angle indicators */}
          {showSelector && (
            <g>
              {/* Tan line - from selected point on circle to x-axis (tangent line) */}
              <line
                x1={selectedPos.x - centerX > 0 ? selectedPos.x : centerX}
                y1={selectedPos.x - centerX > 0 ? selectedPos.y : centerY}
                x2={centerX + radius}
                y2={centerY - radius * Math.tan((selectedAngle * Math.PI) / 180)}
                className={'text-neutral-950 dark:text-neutral-100'}
                stroke={'currentColor'}
                strokeWidth={2 * scale}
                strokeDasharray="5,5"
              />

              {/* Sin line (vertical) - from x-axis to point */}
              <line
                x1={selectedPos.x}
                y1={centerY}
                x2={selectedPos.x}
                y2={selectedPos.y}
                className={'text-red-600 dark:text-red-500'}
                stroke="currentColor"
                strokeWidth={2 * scale}
                strokeDasharray="5,5"
              />

              {/* Cos line (horizontal) - from y-axis to point */}
              <line
                x1={centerX}
                y1={selectedPos.y}
                x2={selectedPos.x}
                y2={selectedPos.y}
                className={'text-green-600 dark:text-green-500'}
                stroke="currentColor"
                strokeWidth={2 * scale}
                strokeDasharray="5,5"
              />

              {/* Tan vertical line - from tangent point to x-axis */}
              <line
                x1={centerX + radius}
                y1={centerY - radius * Math.tan((selectedAngle * Math.PI) / 180)}
                x2={centerX + radius}
                y2={centerY}
                className={'text-blue-600 dark:text-blue-500'}
                stroke="currentColor"
                strokeWidth={2 * scale}
                strokeDasharray="5,5"
              />

              {/* Line from center to selected point */}
              <line
                x1={centerX}
                y1={centerY}
                x2={selectedPos.x}
                y2={selectedPos.y}
                className={'text-neutral-950 dark:text-neutral-100'}
                stroke="currentColor"
                strokeWidth={3 * scale}
              />

              {/* Selected point */}
              <circle
                cx={selectedPos.x}
                cy={selectedPos.y}
                r={8 * scale}
                className="text-neutral-950 dark:text-neutral-100 fill-neutral-100 dark:fill-neutral-950"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={3 * scale}
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default UnitCircle;
