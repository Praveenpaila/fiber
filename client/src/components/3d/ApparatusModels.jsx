import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Laser Source (650 nm Diode)
export function LaserSourceModel({ isHotspotActive = false }) {
  const laserRef = useRef();

  return (
    <group ref={laserRef} position={[0, 0, 0]}>
      {/* Main diode chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.2, 1.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Front output snout / collimator */}
      <mesh position={[1.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Optical connector ferrule port */}
      <mesh position={[1.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* 650 nm Laser Aperture emitting diode indicator */}
      <mesh position={[1.63, 0, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Power switch toggle */}
      <mesh position={[-0.8, 0.65, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>

      {/* Rear heat sink fins */}
      {[-0.6, -0.8, -1.0].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0]}>
          <boxGeometry args={[0.05, 1.3, 1.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
        </mesh>
      ))}

      {/* Base mounting foot */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[2.0, 0.1, 1.0]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  );
}

// 2. Optical Fiber Cable with Connector
export function OpticalFiberModel() {
  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, -0.5, 0),
      new THREE.Vector3(-1.0, 0.8, 0.5),
      new THREE.Vector3(0, 0.3, -0.6),
      new THREE.Vector3(1.0, 0.9, 0.4),
      new THREE.Vector3(1.8, -0.4, 0)
    ]);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Fiber cable sheath */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.08, 16, false]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Input SMA connector */}
      <group position={[-1.8, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Output polished tip connector */}
      <group position={[1.8, -0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// 3. Fiber Holder with V-Clamp
export function FiberHolderModel() {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Heavy base post mount */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 0.25, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Vertical riser pillar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.4, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Collar collar adjustment ring */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* V-Clamp main body */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* V-Groove visual slot */}
      <mesh position={[0, 0.98, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.12, 0.15, 0.82]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Mounted fiber tip passing through groove */}
      <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Knurled clamping thumbscrew */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// 4. Target Screen with Concentric Circles
export function ScreenModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Upright support post */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.6, 0.65, 0.2, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Main target plate */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 2.2, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Screen frame border */}
      <mesh position={[0, 0.3, -0.05]}>
        <boxGeometry args={[2.3, 2.3, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Concentric rings on screen face */}
      {[0.25, 0.5, 0.75, 1.0].map((radius, idx) => (
        <mesh key={idx} position={[0, 0.3, 0.045]} rotation={[0, 0, 0]}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
          <meshBasicMaterial color="#64748b" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Center cross-hairs */}
      <mesh position={[0, 0.3, 0.045]}>
        <planeGeometry args={[1.9, 0.015]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.3, 0.045]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[1.9, 0.015]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>

      {/* Central alignment cross point */}
      <mesh position={[0, 0.3, 0.048]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

// 5. Optical Bench with Sliders
export function OpticalBenchModel() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Twin aluminum guide rails */}
      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[4.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <boxGeometry args={[4.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* End support brackets */}
      {[-2.05, 2.05].map((x, idx) => (
        <group key={idx} position={[x, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 0.3, 1.0]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Leveling screw */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Three bench riders with locking screws */}
      {[-1.2, 0, 1.2].map((x, idx) => (
        <group key={idx} position={[x, 0.12, 0]}>
          <mesh>
            <boxGeometry args={[0.6, 0.12, 0.9]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Central upright collar */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.18, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Side brass locking thumbscrew */}
          <mesh position={[0, 0, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 6. Meter Scale
export function MeterScaleModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Stainless steel bar rule */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.0, 0.4, 0.04]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Graduation ticks and index marks */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, idx) => (
        <group key={idx} position={[x, 0.05, 0.022]}>
          <mesh>
            <planeGeometry args={[0.02, 0.15]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Combined Assembled Bench Scene with laser beam and cone
export function AssembledBenchScene({ isExploded = false, distanceL = 4.0, spotD = 3.2 }) {
  // Exploded offsets
  const explodeY = isExploded ? 0.8 : 0;
  const explodeLaserX = isExploded ? -0.8 : 0;
  const explodeScreenX = isExploded ? 0.8 : 0;

  // Beam Cone calculations based on distanceL and spotD
  const coneLength = 1.4;
  const coneRadius = (spotD / 4.0) * 0.45;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Base Bench Rail */}
      <group position={[0, -1.0, 0]}>
        <OpticalBenchModel />
      </group>

      {/* 2. Laser Source on left slider */}
      <group position={[-2.0 + explodeLaserX, -0.4 + explodeY * 0.4, 0]}>
        <LaserSourceModel />
      </group>

      {/* 3. Optical Fiber Cable coupling */}
      <group position={[-0.9, -0.3 + explodeY * 0.7, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      </group>

      {/* 4. Fiber Holder with tip mounted */}
      <group position={[-0.4, -0.3 + explodeY * 0.2, 0]}>
        <FiberHolderModel />
      </group>

      {/* 5. Emitted Laser Cone from tip to screen (active when assembled) */}
      {!isExploded && (
        <group position={[-0.4, 0.58, 0]}>
          {/* Red diverging beam cone */}
          <mesh position={[coneLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[coneRadius, coneLength, 32, 1, true]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>

          {/* Central axial ray */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={self => {
                const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(coneLength, 0, 0)];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial attach="material" color="#dc2626" linewidth={2} />
          </line>

          {/* Upper and lower bounding boundary rays */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={self => {
                const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(coneLength, coneRadius, 0)];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial attach="material" color="#ef4444" linewidth={1} />
          </line>
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={self => {
                const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(coneLength, -coneRadius, 0)];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial attach="material" color="#ef4444" linewidth={1} />
          </line>
        </group>
      )}

      {/* 6. Screen with concentric target facing fiber tip */}
      <group position={[1.0 + explodeScreenX, -0.4 + explodeY * 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ScreenModel />

        {/* Laser illuminated spot on screen face */}
        {!isExploded && (
          <mesh position={[0, 0.98, 0.05]}>
            <circleGeometry args={[coneRadius, 32]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.85} />
          </mesh>
        )}
      </group>
    </group>
  );
}
