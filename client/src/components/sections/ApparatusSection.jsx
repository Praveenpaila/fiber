import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ApparatusViewer } from '../3d/ApparatusViewer';
import {
  LaserSourceModel,
  OpticalFiberModel,
  FiberHolderModel,
  ScreenModel,
  OpticalBenchModel,
  MeterScaleModel,
  AssembledBenchScene
} from '../3d/ApparatusModels';
import { Layers, CheckCircle2, SlidersHorizontal } from 'lucide-react';

const fallbackApparatusData = [
  {
    key: 'laser_source',
    name: 'Laser Diode Source (650 nm)',
    purpose: 'Provides monochromatic coherent red light for transmission through the optical fiber.',
    specs: [
      'Wavelength: 650 nm (red)',
      'Output power: 2 to 3 mW',
      'Port type: SMA / ST connector port',
      'Laser safety: Class 2 diode'
    ],
    dimensions: '12 cm x 4 cm x 4 cm',
    hotspotLabels: ['Optical Aperture', 'Power Switch', 'Focus Mount'],
    camera: [0, 1.2, 3.2]
  },
  {
    key: 'optical_fiber',
    name: 'Step-Index Multimode Optical Fiber Cable',
    purpose: 'Guides the coupled laser beam via total internal reflection from input to output.',
    specs: [
      'Core diameter: 50 or 62.5 um',
      'Cladding diameter: 125 um',
      'Cable length: 1 meter patch cord',
      'Numerical aperture rating: 0.22 to 0.37'
    ],
    dimensions: '100 cm length, 3 mm outer jacket',
    hotspotLabels: ['Connector Ferrule', 'Fiber Core', 'Cladding Buffer'],
    camera: [0, 1.0, 3.5]
  },
  {
    key: 'fiber_holder',
    name: 'Fiber Holder with V-Clamp',
    purpose: 'Secures and aligns the output end of the optical fiber perpendicular to the target screen.',
    specs: [
      'Precision machined V-groove clamp',
      'Upright mounting post with height collar',
      'Knurled thumbscrew for damage-free clamping'
    ],
    dimensions: '8 cm post height, 3.5 cm clamp width',
    hotspotLabels: ['V-Groove Bed', 'Thumb Screw', 'Vertical Mount Post'],
    camera: [0, 1.0, 3.2]
  },
  {
    key: 'screen',
    name: 'Screen with Concentric Circles',
    purpose: 'Provides calibrated millimeter graduation rings to measure the spot diameter D.',
    specs: [
      'Concentric circles spaced at 2 mm radial intervals',
      'Matte white non-reflective surface',
      'Center cross-hair alignment mark'
    ],
    dimensions: '15 cm x 15 cm square target plate',
    hotspotLabels: ['Center Cross-hair', 'Concentric Rings', 'Millimeter Scale'],
    camera: [0, 0.8, 3.5]
  },
  {
    key: 'optical_bench',
    name: 'Optical Bench with Movable Sliders',
    purpose: 'Provides rigid linear alignment and adjustable positioning for source, fiber, and screen.',
    specs: [
      'Twin-rail extruded aluminum construction',
      'Three sliding riders with brass locking knobs',
      'Leveling thumbscrews at bench ends'
    ],
    dimensions: '100 cm rail length, 10 cm width',
    hotspotLabels: ['Guide Rails', 'Locking Rider', 'Leveling Base'],
    camera: [0, 1.6, 4.2]
  },
  {
    key: 'meter_scale',
    name: 'Precision Meter Scale',
    purpose: 'Measures the separation distance L between the fiber output tip and the projection screen.',
    specs: [
      'Stainless steel with etched millimeter divisions',
      'Zero-error calibration index',
      'Anti-glare satin chrome finish'
    ],
    dimensions: '100 cm length, 2.5 cm width',
    hotspotLabels: ['Millimeter Divisions', 'Centimeter Numerals', 'Reference Edge'],
    camera: [0, 1.2, 3.5]
  }
];

export function ApparatusSection() {
  const [items, setItems] = useState(fallbackApparatusData);
  const [isExploded, setIsExploded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt fetching live seeded apparatus data from backend
    axios.get('/api/apparatus')
      .then(res => {
        if (res.data?.success && res.data.data?.length > 0) {
          // Merge with cameras and local mappings
          const merged = fallbackApparatusData.map(local => {
            const serverItem = res.data.data.find(d => d.key === local.key);
            return serverItem ? { ...local, ...serverItem } : local;
          });
          setItems(merged);
        }
      })
      .catch(() => {
        // Retain fallback data gracefully
      });
  }, []);

  const renderItem3D = (key) => {
    switch (key) {
      case 'laser_source':
        return <LaserSourceModel />;
      case 'optical_fiber':
        return <OpticalFiberModel />;
      case 'fiber_holder':
        return <FiberHolderModel />;
      case 'screen':
        return <ScreenModel />;
      case 'optical_bench':
        return <OpticalBenchModel />;
      case 'meter_scale':
        return <MeterScaleModel />;
      default:
        return null;
    }
  };

  return (
    <section id="apparatus" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
              2. Experimental Apparatus (Interactive 3D)
            </h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Inspect each individual optical component in interactive 3D, or examine the fully aligned bench setup.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 font-mono">
              6 Laboratory Components
            </span>
          </div>
        </div>
      </div>

      {/* Combined Assembled Scene Highlight Banner */}
      <div className="lab-card p-6 bg-surface mb-10 border border-borderline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderline gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              Combined Optical Bench Assembly
            </h3>
            <p className="text-xs text-charcoal-600">
              Laser coupled through multimode fiber with cone divergence projecting onto calibrated screen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className="lab-btn-secondary text-xs"
            >
              <Layers className="w-4 h-4 text-primary" />
              {isExploded ? 'Switch to Assembled View' : 'Switch to Exploded View'}
            </button>
          </div>
        </div>

        <div className="w-full">
          <ApparatusViewer
            cameraPosition={[0, 1.8, 5.0]}
            height="380px"
            enableAutoRotate={false}
          >
            <AssembledBenchScene isExploded={isExploded} distanceL={4.0} spotD={3.2} />
          </ApparatusViewer>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-charcoal-600 pt-2 border-t border-borderline font-mono">
          <span>Active State: {isExploded ? 'Exploded Component Layout' : 'Coaxially Assembled Bench System'}</span>
          <span className="text-primary font-medium">Laser: 650 nm Monochromatic Red Coherent Beam</span>
        </div>
      </div>

      {/* Individual 3D Apparatus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.key} className="lab-card bg-surface overflow-hidden flex flex-col border border-borderline">
            {/* 3D Canvas Header */}
            <div className="relative">
              <ApparatusViewer
                cameraPosition={item.camera || [0, 1.2, 3.5]}
                height="220px"
                enableAutoRotate={false}
              >
                {renderItem3D(item.key)}
              </ApparatusViewer>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-charcoal-900 mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-charcoal-600 mb-3 leading-relaxed">
                  {item.purpose}
                </p>

                {/* Specs list */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-borderline mb-3">
                  <span className="text-[11px] font-semibold text-charcoal-700 block mb-0.5">
                    Technical Specifications:
                  </span>
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="text-[11px] text-charcoal-600 flex items-start gap-1.5 font-mono">
                      <span className="text-primary">•</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-borderline flex items-center justify-between text-[11px] text-charcoal-500 font-mono">
                <span>Dimensions: {item.dimensions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
