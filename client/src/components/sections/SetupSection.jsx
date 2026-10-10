import React from 'react';
import { AlignCenter, CheckCircle2 } from 'lucide-react';

export function SetupSection() {
  const legendItems = [
    { id: 1, title: 'Laser Diode Light Source', desc: 'Monochromatic 650 nm diode light coupled securely into fiber entrance connector.' },
    { id: 2, title: 'Step-Index Optical Fiber', desc: 'Flexible multimode patch cord carrying light through core via total internal reflection.' },
    { id: 3, title: 'Fiber Mount (V-Clamp)', desc: 'Rigid holder positioning fiber tip strictly perpendicular to the projection screen.' },
    { id: 4, title: 'Target Screen with Rings', desc: 'Opaque white screen with concentric millimeter rings to measure illuminated spot diameter D.' },
    { id: 'L', title: 'Axial Distance (L)', desc: 'Perpendicular separation distance measured between fiber exit tip and the screen.' },
    { id: 'D', title: 'Spot Diameter (D)', desc: 'Outer boundary diameter of the circular illuminated red laser cone on screen.' }
  ];

  return (
    <section id="setup" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          3. Experimental Setup and Bench Alignment
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Coaxial schematic diagram illustrating source mounting, fiber holder clamping, and projection geometry.
        </p>
      </div>

      <div className="lab-card p-6 sm:p-8 bg-surface border border-borderline">
        {/* Labeled Technical Diagram */}
        <div className="bg-slate-50 border border-borderline rounded p-4 mb-6">
          <img
            src="/images/setup_diagram.svg"
            alt="Technical schematic of optical bench arrangement showing laser, fiber, emitted cone, distance L, and spot diameter D"
            className="w-full h-auto max-h-[460px] mx-auto block rounded"
          />
          <p className="text-center text-xs text-charcoal-500 font-mono mt-3">
            Figure 2: Geometric arrangement for measuring spot divergence as a function of distance L
          </p>
        </div>

        {/* Legend and Bench Arrangement Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-borderline">
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold text-charcoal-900 mb-3 flex items-center gap-2">
              <AlignCenter className="w-4 h-4 text-primary" />
              Bench Alignment Instructions
            </h3>
            <div className="space-y-2.5 text-xs text-charcoal-700 leading-relaxed">
              <p>
                1. Mount the laser source rider at the zero-centimeter index of the optical bench and lock the thumbscrew securely.
              </p>
              <p>
                2. Position the fiber holder rider at an intermediate station, keeping sufficient cable slack to avoid bending stress.
              </p>
              <p>
                3. Clamp the free end of the fiber into the V-groove so that the polished tip protrudes horizontally towards the screen.
              </p>
              <p>
                4. Position the projection screen on a third rider facing the fiber tip. Verify that the beam axis passes directly through the center cross-hair of the target plate.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-sm font-bold text-charcoal-900 mb-3">
              Numbered Schematic Legend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {legendItems.map((item) => (
                <div key={item.id} className="p-2 bg-slate-50 border border-borderline rounded flex items-start gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-[11px] font-bold rounded font-mono shrink-0">
                    {item.id}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-charcoal-800 block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-charcoal-600 block">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
