'use client';

import { useEffect, useState, useCallback } from 'react';

interface MousePosition {
  x: number; // -1 to 1
  y: number; // -1 to 1
  clientX: number;
  clientY: number;
}

export function useMouseParallax(sensitivity: number = 0.02) {
  const [mouse, setMouse] = useState<MousePosition>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({
        x: x * sensitivity,
        y: y * sensitivity,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    },
    [sensitivity]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return mouse;
}
