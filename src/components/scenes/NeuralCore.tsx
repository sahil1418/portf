'use client';

import { type ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

const NODE_COUNT = 110;
const SHELL_RADIUS = 2.15;
const NEIGHBOURS = 3;
const PULSE_COUNT = 70;
const DUST_COUNT = 1400;

const CYAN = new THREE.Color('#22e6ff');
const VIOLET = new THREE.Color('#8b5cf6');

/** Evenly spread points on a sphere (Fibonacci lattice) with a little jitter. */
function buildNetwork() {
  const nodes: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = 1 + (Math.sin(i * 12.9898) * 0.5) * 0.18;
    nodes.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(SHELL_RADIUS * jitter));
  }

  const edgeKeys = new Set<string>();
  const edges: [number, number][] = [];
  const adjacency: number[][] = nodes.map(() => []);

  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBOURS)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (edgeKeys.has(key)) return;
        edgeKeys.add(key);
        edges.push([i, j]);
        adjacency[i].push(j);
        adjacency[j].push(i);
      });
  });

  return { nodes, edges, adjacency };
}

function NeuralNetwork({ reducedMotion }: { reducedMotion: boolean }) {
  const { nodes, edges, adjacency } = useMemo(buildNetwork, []);
  const pulseGeometryRef = useRef<THREE.BufferGeometry>(null);

  const nodePositions = useMemo(() => {
    const array = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.toArray(array, i * 3));
    return array;
  }, [nodes]);

  const edgePositions = useMemo(() => {
    const array = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(array, i * 6);
      nodes[b].toArray(array, i * 6 + 3);
    });
    return array;
  }, [edges, nodes]);

  const edgeColors = useMemo(() => {
    const array = new Float32Array(edges.length * 6);
    const color = new THREE.Color();
    edges.forEach(([a, b], i) => {
      color.copy(VIOLET).lerp(CYAN, (nodes[a].y / SHELL_RADIUS + 1) / 2).toArray(array, i * 6);
      color.copy(VIOLET).lerp(CYAN, (nodes[b].y / SHELL_RADIUS + 1) / 2).toArray(array, i * 6 + 3);
    });
    return array;
  }, [edges, nodes]);

  // Signals hop node → node along edges, like activations propagating through a graph.
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, (_, i) => {
        const [from, to] = edges[(i * 7) % edges.length];
        return { from, to, t: (i / PULSE_COUNT) % 1, speed: 0.45 + ((i * 37) % 10) / 14 };
      }),
    [edges],
  );
  const pulsePositions = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05) * (reducedMotion ? 0.25 : 1);
    const scratch = new THREE.Vector3();

    pulses.forEach((pulse, i) => {
      pulse.t += step * pulse.speed;
      if (pulse.t >= 1) {
        const options = adjacency[pulse.to].filter((n) => n !== pulse.from);
        pulse.from = pulse.to;
        pulse.to = options.length ? options[Math.floor(Math.random() * options.length)] : adjacency[pulse.to][0];
        pulse.t = 0;
      }
      scratch.lerpVectors(nodes[pulse.from], nodes[pulse.to], pulse.t).toArray(pulsePositions, i * 3);
    });

    const attribute = pulseGeometryRef.current?.getAttribute('position');
    if (attribute) attribute.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[edgeColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#9eeaff" size={0.055} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>

      <points>
        <bufferGeometry ref={pulseGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={new THREE.Color('#7ff6ff').multiplyScalar(3)}
          size={0.09}
          sizeAttenuation
          transparent
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: [number, number, number]; speed: number; color: string }) {
  const satelliteRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return;
    const angle = clock.elapsedTime * speed;
    satelliteRef.current.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh ref={satelliteRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={new THREE.Color(color).multiplyScalar(4)} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const r = 3 + Math.pow(Math.random(), 0.6) * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      array[i * 3 + 2] = r * Math.cos(phi);
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b9c6ff" size={0.022} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Core({ reducedMotion }: { reducedMotion: boolean }) {
  const rigRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<ElementRef<typeof MeshDistortMaterial>>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, size } = useThree();

  // Sit to the right of the copy on wide screens, centred behind it on narrow ones.
  const wide = size.width >= 960;
  const offsetX = wide ? viewport.width * 0.23 : 0;
  const scale = wide ? 0.8 : Math.min(0.75, viewport.width / 7);

  useFrame(({ pointer, clock }, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    rig.rotation.y += delta * (reducedMotion ? 0.03 : 0.12);
    rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, -pointer.y * 0.35 + scrollProgress * 0.6, 0.05);
    rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, pointer.x * 0.2, 0.05);
    rig.position.x = THREE.MathUtils.lerp(rig.position.x, offsetX + pointer.x * 0.25, 0.05);
    rig.position.y = THREE.MathUtils.lerp(rig.position.y, pointer.y * 0.18 + scrollProgress * 1.2, 0.05);

    if (shellRef.current) {
      shellRef.current.rotation.x = clock.elapsedTime * -0.08;
      shellRef.current.rotation.y = clock.elapsedTime * -0.12;
    }

    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, hovered ? 0.55 : 0.32, 0.06);
    }
  });

  return (
    <group ref={rigRef} scale={scale}>
      <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={0.35} floatIntensity={0.6}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#2b3a9e"
            emissive="#2a0f7a"
            emissiveIntensity={0.4}
            roughness={0.08}
            metalness={0.55}
            clearcoat={1}
            iridescence={1}
            iridescenceIOR={1.6}
            distort={0.32}
            speed={reducedMotion ? 0.4 : 2.2}
          />
        </mesh>

        <mesh ref={shellRef} scale={1.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#38e8ff" wireframe transparent opacity={0.22} toneMapped={false} />
        </mesh>

        <NeuralNetwork reducedMotion={reducedMotion} />
      </Float>

      <OrbitRing radius={2.75} tilt={[1.2, 0.3, 0]} speed={0.6} color="#22e6ff" />
      <OrbitRing radius={3.1} tilt={[-0.9, -0.5, 0.4]} speed={-0.42} color="#a78bfa" />
      <OrbitRing radius={3.45} tilt={[0.2, 1.1, -0.3]} speed={0.3} color="#f472b6" />
    </group>
  );
}

export default function NeuralCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 5]} intensity={60} color="#22e6ff" />
        <pointLight position={[-5, -2, 2]} intensity={45} color="#a855f7" />
        <pointLight position={[0, -4, -3]} intensity={30} color="#f472b6" />
        <directionalLight position={[0, 5, 5]} intensity={0.6} />

        <Dust />
        <Core reducedMotion={reducedMotion} />

        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.2} radius={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
