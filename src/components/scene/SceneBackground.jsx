import React, { Component, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import InfinityScene from './InfinityScene';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('[NexForever 3D] WebGL Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scene-fallback" aria-hidden="true">
          <div className="fallback-glow" />
        </div>
      );
    }
    return this.props.children;
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function SceneBackground() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [isPageHidden, setIsPageHidden] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());

    const handleVisibility = () => {
      setIsPageHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  if (!webglSupported) {
    return (
      <div className="scene-background" aria-hidden="true">
        <div className="scene-fallback">
          <div className="fallback-glow" />
        </div>
      </div>
    );
  }

  return (
    <div className="scene-background" aria-hidden="true">
      <WebGLErrorBoundary>
        <Suspense fallback={null}>
          <Canvas
            frameloop={isPageHidden ? 'never' : 'always'}
            camera={{ position: [0, 0, 7.2], fov: 42 }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
            onCreated={({ gl }) => {
              const handleContextLost = (e) => {
                e.preventDefault();
                console.warn('[NexForever 3D] WebGL context lost.');
              };
              gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
            }}
          >
            <InfinityScene />
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
