'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  color?: string;
  active?: boolean;
}

export default function WaveformScene({ color = '#00ffcc', active = false }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const numPoints = 100;
  const width = 6;
  
  const linesData = useMemo(() => {
    return [
      { freq: 1, amp: 0.8, phase: 0 },
      { freq: 2.5, amp: 0.4, phase: Math.PI / 4 },
      { freq: 0.5, amp: 1.2, phase: Math.PI / 2 }
    ];
  }, []);

  const [points1, points2, points3] = useMemo(() => {
    const createEmptyPoints = () => Array(numPoints).fill(0).map(() => new THREE.Vector3());
    return [createEmptyPoints(), createEmptyPoints(), createEmptyPoints()];
  }, [numPoints]);

  useFrame((state) => {
    const time = state.clock.elapsedTime * (active ? 2 : 1);
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.2;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.1;
    }

    [points1, points2, points3].forEach((points, lineIdx) => {
      const data = linesData[lineIdx];
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1) - 0.5) * width;
        const timeOffset = time * 2;
        const y = Math.sin(x * data.freq + timeOffset + data.phase) * data.amp * 
                  Math.sin(time * 0.5 + x) * 0.8; // Interference
        points[i].set(x, y, lineIdx * 0.2 - 0.2);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Line points={points1 as THREE.Vector3[]} color={color} lineWidth={2} transparent opacity={0.9} />
      <Line points={points1 as THREE.Vector3[]} color={color} lineWidth={6} transparent opacity={0.2} />
      
      <Line points={points2 as THREE.Vector3[]} color={color} lineWidth={1.5} transparent opacity={0.6} />
      <Line points={points2 as THREE.Vector3[]} color={color} lineWidth={4} transparent opacity={0.1} />
      
      <Line points={points3 as THREE.Vector3[]} color={color} lineWidth={2.5} transparent opacity={0.7} />
      <Line points={points3 as THREE.Vector3[]} color={color} lineWidth={8} transparent opacity={0.15} />
    </group>
  );
}
