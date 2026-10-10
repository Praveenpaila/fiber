import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RotateCcw, Play, Pause } from 'lucide-react';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function ApparatusViewer({
  children,
  cameraPosition = [0, 1.5, 3.8],
  enableAutoRotate = false,
  showControls = true,
  height = '320px'
}) {
  const [autoRotate, setAutoRotate] = useState(enableAutoRotate);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!hasWebGL) {
    return (
      <div
        style={{ height }}
        className="w-full flex flex-col items-center justify-center bg-slate-100 border border-borderline rounded text-charcoal-700 p-6 text-center"
      >
        <p className="font-semibold text-sm mb-1">WebGL Acceleration Unavailable</p>
        <p className="text-xs text-charcoal-600 max-w-sm">
          Your browser or display adapter does not support WebGL. A static schematic is displayed instead.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full relative bg-slate-100 border border-borderline rounded overflow-hidden">
      {/* Top right control buttons */}
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1.5 bg-surface border border-borderline rounded text-xs text-charcoal-700 hover:bg-slate-50 transition-colors"
            title={autoRotate ? 'Pause 3D rotation' : 'Enable 3D auto-rotate'}
            aria-label={autoRotate ? 'Pause 3D rotation' : 'Enable 3D auto-rotate'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#f1f5f9' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />

        <Suspense fallback={null}>
          {children}
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          enableDamping
          dampingFactor={0.05}
          maxDistance={12}
          minDistance={1.2}
        />
      </Canvas>

      <div className="absolute bottom-2 left-2 pointer-events-none text-[11px] text-charcoal-500 bg-surface/90 px-1.5 py-0.5 border border-borderline rounded font-mono">
        Drag to rotate | Scroll to zoom
      </div>
    </div>
  );
}
