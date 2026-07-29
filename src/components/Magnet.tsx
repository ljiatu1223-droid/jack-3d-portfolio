import { useState, useRef, useCallback, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const [transition, setTransition] = useState(inactiveTransition);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = (e.clientX - centerX) / strength;
      const distY = (e.clientY - centerY) / strength;

      const isInside =
        e.clientX >= left - padding &&
        e.clientX <= left + width + padding &&
        e.clientY >= top - padding &&
        e.clientY <= top + height + padding;

      if (isInside) {
        setTransition(activeTransition);
        setTransform(`translate3d(${distX}px, ${distY}px, 0)`);
      }
    },
    [padding, strength, activeTransition]
  );

  const handleMouseLeave = useCallback(() => {
    setTransition(inactiveTransition);
    setTransform('translate3d(0, 0, 0)');
  }, [inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}