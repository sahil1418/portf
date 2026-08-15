'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  color?: string; // We'll map colors but use this as a base or tint if needed, or follow instructions
  active?: boolean;
}

export default function PointCloudScene({ color = '#00ffff', active = false }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const gridSize = 45;
  const numPoints = gridSize * gridSize;
  const extent = 6;

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(numPoints * 3);
    const col = new Float32Array(numPoints * 3);
    const siz = new Float32Array(numPoints);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        const x = (i / (gridSize - 1) - 0.5) * extent;
        const z = (j / (gridSize - 1) - 0.5) * extent;
        
        pos[idx * 3] = x;
        pos[idx * 3 + 1] = 0; // Set in useFrame
        pos[idx * 3 + 2] = z;

        col[idx * 3] = 1;
        col[idx * 3 + 1] = 1;
        col[idx * 3 + 2] = 1;

        siz[idx] = Math.random() * 0.5 + 0.5;
      }
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [numPoints, gridSize, extent]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, [positions, colors, sizes]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorBase: { value: new THREE.Color('#001144') },
        colorMid: { value: new THREE.Color('#00ffff') },
        colorTop: { value: new THREE.Color('#ffffff') }
      },
      vertexShader: `
        uniform float time;
        attribute float aSize;
        varying vec3 vColor;
        varying float vHeight;
        
        void main() {
          vec3 pos = position;
          // Perlin-like simple noise
          float h = sin(pos.x * 1.5 + time) * 0.3 + cos(pos.z * 1.5 + time * 0.8) * 0.3;
          h += sin(pos.x * 3.0 - time * 1.5) * 0.1 * cos(pos.z * 2.0);
          pos.y = h;
          vHeight = h;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float sizeAnim = aSize + sin(time * 3.0 + aSize * 10.0) * 0.3;
          gl_PointSize = (4.0 * sizeAnim) * (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 colorBase;
        uniform vec3 colorMid;
        uniform vec3 colorTop;
        varying float vHeight;
        
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          
          vec3 finalColor;
          if (vHeight < 0.0) {
            finalColor = mix(colorBase, colorMid, vHeight + 1.0);
          } else {
            finalColor = mix(colorMid, colorTop, vHeight * 1.5);
          }
          
          gl_FragColor = vec4(finalColor, 1.0 - (ll * 2.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime * (active ? 1.5 : 0.8);
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      pointsRef.current.rotation.x = Math.PI / 8;
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
