'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vWave;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float primaryWave = sin(position.x * 0.78 + uTime * 0.72) * 0.7;
    float secondaryWave = cos(position.y * 1.04 - uTime * 0.53) * 0.42;
    float diagonalWave = sin((position.x + position.y) * 0.52 - uTime * 0.38) * 0.32;
    vWave = primaryWave + secondaryWave + diagonalWave;
    transformed.z += vWave;
    transformed.x += sin(position.y * 0.5 + uTime * 0.32) * 0.16 + uPointer.x * 0.14;
    transformed.y += cos(position.x * 0.42 - uTime * 0.28) * 0.1 + uPointer.y * 0.09;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const filledFragmentShader = `
  uniform float uOpacity;
  varying float vWave;
  varying vec2 vUv;

  void main() {
    float energy = smoothstep(-1.2, 1.3, vWave);
    vec3 violet = vec3(0.25, 0.08, 0.7);
    vec3 cyan = vec3(0.0, 0.85, 1.0);
    vec3 color = mix(violet, cyan, energy);
    float edgeFade = smoothstep(0.0, 0.16, vUv.x) * smoothstep(0.0, 0.16, 1.0 - vUv.x);
    edgeFade *= smoothstep(0.0, 0.13, vUv.y) * smoothstep(0.0, 0.13, 1.0 - vUv.y);
    gl_FragColor = vec4(color, uOpacity * edgeFade * (0.38 + energy * 0.62));
  }
`;

const wireFragmentShader = `
  uniform float uOpacity;
  varying float vWave;

  void main() {
    float energy = smoothstep(-1.15, 1.25, vWave);
    vec3 violet = vec3(0.53, 0.26, 1.0);
    vec3 cyan = vec3(0.1, 0.95, 1.0);
    gl_FragColor = vec4(mix(violet, cyan, energy), uOpacity * (0.36 + energy * 0.64));
  }
`;

function RollingField() {
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const geometry = useMemo(() => new THREE.PlaneGeometry(23, 15, 104, 68), []);

  const filledMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: filledFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uOpacity: { value: 0.08 },
    },
  }), []);

  const wireMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: wireFragmentShader,
    transparent: true,
    depthWrite: false,
    wireframe: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uOpacity: { value: 0.18 },
    },
  }), []);

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#34e7ff',
    transparent: true,
    opacity: 0.08,
    wireframe: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (event.clientY / window.innerHeight - 0.5) * -2;
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    filledMaterial.dispose();
    wireMaterial.dispose();
    ringMaterial.dispose();
  }, [filledMaterial, geometry, ringMaterial, wireMaterial]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const scrollFade = Math.max(0.22, 1 - window.scrollY / Math.max(window.innerHeight * 1.15, 1));
    const targetPointer = new THREE.Vector2(pointerRef.current.x, pointerRef.current.y);

    filledMaterial.uniforms.uTime.value = time;
    filledMaterial.uniforms.uPointer.value.lerp(targetPointer, 0.035);
    filledMaterial.uniforms.uOpacity.value = 0.07 * scrollFade;

    wireMaterial.uniforms.uTime.value = time;
    wireMaterial.uniforms.uPointer.value.lerp(targetPointer, 0.035);
    wireMaterial.uniforms.uOpacity.value = 0.16 * scrollFade;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.16) * 0.045;
      groupRef.current.rotation.y += (targetPointer.x * 0.09 - groupRef.current.rotation.y) * 0.025;
      groupRef.current.position.y = Math.sin(time * 0.25) * 0.18;
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.28, 0, 0]} position={[0, -0.15, -3.8]}>
      <mesh geometry={geometry} material={filledMaterial} />
      <mesh geometry={geometry} material={wireMaterial} />
      <mesh position={[5.8, 1.9, -1.5]} rotation={[0.72, 0.15, 0]} material={ringMaterial}>
        <torusKnotGeometry args={[1.35, 0.022, 180, 12]} />
      </mesh>
      <mesh position={[-6.8, -2.5, -2.4]} rotation={[-0.45, -0.35, 0.2]} material={ringMaterial}>
        <torusGeometry args={[1.5, 0.018, 10, 120]} />
      </mesh>
    </group>
  );
}

export default function StarfieldBackground() {
  return (
    <div className="kinetic-background" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <RollingField />
      </Canvas>
      <style jsx>{`
        .kinetic-background {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
          filter: blur(1.5px);
        }
      `}</style>
    </div>
  );
}
