'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  color?: string;
  active?: boolean;
}

export default function GlobeScene({ color = '#00ffff', active = false }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  
  const numDots = 40;
  const radius = 1.5;

  const dotPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < numDots; i++) {
      const phi = Math.acos(-1 + (2 * i) / numDots);
      const theta = Math.sqrt(numDots * Math.PI) * phi;
      pos.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ));
    }
    return pos;
  }, [numDots, radius]);

  const arcs = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 4; i++) {
      const start = dotPositions[Math.floor(Math.random() * numDots)];
      const end = dotPositions[Math.floor(Math.random() * numDots)];
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(radius * 1.3);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      lines.push(curve.getPoints(20));
    }
    return lines;
  }, [dotPositions]);

  useFrame((state, delta) => {
    const speed = active ? 0.4 : 0.15;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (dotsRef.current) {
      const dummy = new THREE.Object3D();
      dotPositions.forEach((pos, i) => {
        dummy.position.copy(pos);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.5;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        dotsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dotsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[radius, 16, 16]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
        </mesh>
        
        <instancedMesh ref={dotsRef} args={[undefined, undefined, numDots]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={color} />
        </instancedMesh>

        {arcs.map((points, i) => (
          <Line
            key={i}
            points={points}
            color={color}
            lineWidth={1.5}
            transparent
            opacity={0.4}
          />
        ))}
      </group>
    </Float>
  );
}
