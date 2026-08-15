'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  color?: string;
  active?: boolean;
}

export default function DagScene({ color = '#ffb300', active = false }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const numNodes = 10;
  
  const { positions, edges } = useMemo(() => {
    const pos = [];
    for (let i = 0; i < numNodes; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2
      ));
    }
    const edg = [];
    for (let i = 0; i < numNodes - 1; i++) {
      edg.push([pos[i], pos[i + 1]]);
      if (i < numNodes - 2 && Math.random() > 0.5) {
        edg.push([pos[i], pos[i + 2]]);
      }
    }
    return { positions: pos, edges: edg };
  }, [numNodes]);

  const particleData = useMemo(() => {
    return edges.map(edge => ({
      start: edge[0],
      end: edge[1],
      progress: Math.random()
    }));
  }, [edges]);

  const particlesGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edges.length * 3), 3));
    return geom;
  }, [edges]);

  useFrame((state, delta) => {
    const speed = active ? 0.6 : 0.2;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }

    if (nodesRef.current) {
      const dummy = new THREE.Object3D();
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (particlesRef.current) {
      const positionsAttr = particlesRef.current.geometry.attributes.position;
      particleData.forEach((data, i) => {
        data.progress += delta * speed;
        if (data.progress > 1) data.progress = 0;
        
        const currentPos = new THREE.Vector3().copy(data.start).lerp(data.end, data.progress);
        positionsAttr.setXYZ(i, currentPos.x, currentPos.y, currentPos.z);
      });
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, numNodes]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </instancedMesh>

      {edges.map((edge, i) => (
        <Line
          key={i}
          points={edge}
          color={color}
          transparent
          opacity={0.2}
          lineWidth={1}
        />
      ))}

      <points ref={particlesRef} geometry={particlesGeom}>
        <pointsMaterial color={'#ffffff'} size={0.06} sizeAttenuation transparent opacity={0.8} />
      </points>
    </group>
  );
}
