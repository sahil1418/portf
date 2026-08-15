'use client';

import React, { Suspense, useMemo, Component, ReactNode, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import dynamic from 'next/dynamic';

interface SceneRendererProps {
  sceneType: 'globe' | 'mesh' | 'dag' | 'waveform' | 'pointcloud' | 'crystal' | string;
  color?: string;
  active?: boolean;
  className?: string;
}

const GlobeScene = dynamic(() => import('./GlobeScene'), { ssr: false });
const MeshScene = dynamic(() => import('./MeshScene'), { ssr: false });
const DagScene = dynamic(() => import('./DagScene'), { ssr: false });
const WaveformScene = dynamic(() => import('./WaveformScene'), { ssr: false });
const PointCloudScene = dynamic(() => import('./PointCloudScene'), { ssr: false });
const CrystalScene = dynamic(() => import('./CrystalScene'), { ssr: false });

function Fallback({ color }: { color: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)`,
      }}
    />
  );
}

// Simple error boundary without external dependency
class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function RenderOnChange({ active, color }: { active: boolean; color: string }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [active, color, invalidate]);

  return null;
}

export default function SceneRenderer({
  sceneType,
  color = '#ffffff',
  active = false,
  className = '',
}: SceneRendererProps) {
  const SceneComponent = useMemo(() => {
    switch (sceneType.toLowerCase()) {
      case 'globe': return GlobeScene;
      case 'mesh': return MeshScene;
      case 'dag': return DagScene;
      case 'waveform': return WaveformScene;
      case 'pointcloud': return PointCloudScene;
      case 'crystal': return CrystalScene;
      default: return GlobeScene;
    }
  }, [sceneType]);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <SceneErrorBoundary fallback={<Fallback color={color} />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.25]}
          frameloop={active ? 'always' : 'demand'}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
          style={{ background: 'transparent' }}
        >
          <RenderOnChange active={active} color={color} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <SceneComponent color={color} active={active} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
