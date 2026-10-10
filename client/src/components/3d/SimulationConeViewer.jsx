import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function SimulationScene({ L = 4.0, D = 3.2 }) {
  const numL = parseFloat(L) || 4.0;
  const numD = parseFloat(D) || 3.2;

  // Scale down cm to 3D units for natural visualization: 1 cm = 0.5 units
  const length3D = Math.max(numL * 0.4, 0.5);
  const radius3D = Math.max((numD / 2) * 0.4, 0.1);

  // Position fiber tip at x = -length3D / 2, screen at x = length3D / 2
  const tipX = -length3D / 2;
  const screenX = length3D / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Fiber Holder Tip */}
      <mesh position={[tipX - 0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 24]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Red Laser Emitter Point */}
      <mesh position={[tipX, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Light cone projecting from tip to screen */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[radius3D, length3D, 48, 1, true]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Central axis ray */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={self => {
            self.setFromPoints([new THREE.Vector3(tipX, 0, 0), new THREE.Vector3(screenX, 0, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#dc2626" linewidth={2} />
      </line>

      {/* Boundary bounding rays */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={self => {
            self.setFromPoints([new THREE.Vector3(tipX, 0, 0), new THREE.Vector3(screenX, radius3D, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#ef4444" linewidth={1} />
      </line>
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={self => {
            self.setFromPoints([new THREE.Vector3(tipX, 0, 0), new THREE.Vector3(screenX, -radius3D, 0)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#ef4444" linewidth={1} />
      </line>

      {/* Target Screen with Concentric Rings */}
      <group position={[screenX, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Screen plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 3.2, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[3.3, 3.3, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Concentric rings */}
        {[0.3, 0.6, 0.9, 1.2].map((r, i) => (
          <mesh key={i} position={[0, 0, 0.035]}>
            <ringGeometry args={[r - 0.008, r + 0.008, 48]} />
            <meshBasicMaterial color="#94a3b8" side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Projected laser circle spot on screen face */}
        <mesh position={[0, 0, 0.038]}>
          <circleGeometry args={[radius3D, 48]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export function SimulationConeViewer({ L = 4.0, D = 3.2 }) {
  return (
    <div className="w-full h-72 bg-slate-100 border border-borderline rounded overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 1.8, 3.5], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: '#f1f5f9' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} />
        <Suspense fallback={null}>
          <SimulationScene L={L} D={D} />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={8} minDistance={1.2} />
      </Canvas>
      <div className="absolute top-2 left-2 pointer-events-none text-xs bg-surface/90 px-2 py-1 border border-borderline rounded font-mono text-charcoal-700">
        Distance L: {Number(L).toFixed(2)} cm | Spot Diameter D: {Number(D).toFixed(2)} cm
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none text-[11px] text-charcoal-500 bg-surface/90 px-1.5 py-0.5 border border-borderline rounded font-mono">
        Orbit: drag | Zoom: scroll
      </div>
    </div>
  );
}
