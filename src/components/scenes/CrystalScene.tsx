'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  color?: string;
  active?: boolean;
}

export default function CrystalScene({ color = '#cc00ff', active = false }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const speed = active ? 0.8 : 0.2;
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 1.2;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * speed;
      wireframeRef.current.rotation.y += delta * speed * 1.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          specularIntensity={1}
          envMapIntensity={1}
          transparent
        />
      </mesh>
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.22, 0]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}
