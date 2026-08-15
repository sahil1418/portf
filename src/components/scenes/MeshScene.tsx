'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  color?: string;
  active?: boolean;
}

export default function MeshScene({ color = '#ff00ff', active = false }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => new THREE.PlaneGeometry(5, 5, 50, 50), []);
  const basePositions = useMemo(() => geometry.attributes.position.array.slice(), [geometry]);

  useFrame((state) => {
    const time = state.clock.elapsedTime * (active ? 1.5 : 0.8);
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const ix = i * 3;
        const x = basePositions[ix];
        const y = basePositions[ix + 1];
        const distance = Math.sqrt(x * x + y * y);
        const z = Math.sin(distance * 3 - time) * 0.2 + Math.cos(x * 2 + time * 0.5) * 0.1;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      meshRef.current.rotation.x = -Math.PI / 2.5 + Math.sin(time * 0.2) * 0.1;
      meshRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
