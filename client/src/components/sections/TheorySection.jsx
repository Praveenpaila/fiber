import React from 'react';
import { MathFormula } from '../MathFormula';
import { TheoryRayDiagram } from '../TheoryRayDiagram';
import { BookOpen } from 'lucide-react';

export function TheorySection() {
  return (
    <section id="theory" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          4. Theory and Working Principle
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Mathematical derivation of Numerical Aperture from Snell's law and total internal reflection.
        </p>
      </div>

      <div className="space-y-8">
        {/* Derivation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Total Internal Reflection & Critical Angle */}
          <div className="lab-card p-6 bg-surface border border-borderline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded bg-slate-100 border border-borderline flex items-center justify-center text-xs font-mono font-bold text-primary">
                  1
                </span>
                <h3 className="font-bold text-charcoal-900 text-sm">
                  Total Internal Reflection (TIR) and Critical Angle
                </h3>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed mb-4">
                When light travels from an optically denser medium (core with refractive index <MathFormula math="n_1" />) toward an optically rarer medium (cladding with refractive index <MathFormula math="n_2" />, where <MathFormula math="n_1 > n_2" />), the ray refracts away from the normal. At the critical angle <MathFormula math="\theta_c" />, the angle of refraction equals 90&deg;.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded border border-borderline">
              <span className="text-[11px] font-semibold text-charcoal-600 block mb-1 font-mono">
                Critical Angle Condition:
              </span>
              <MathFormula
                math="\sin(\theta_c) = \frac{n_2}{n_1} \implies \theta_c = \arcsin\left(\frac{n_2}{n_1}\right)"
                block
                className="text-center font-semibold"
              />
            </div>
          </div>

          {/* Card 2: Acceptance Angle and Theoretical NA */}
          <div className="lab-card p-6 bg-surface border border-borderline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded bg-slate-100 border border-borderline flex items-center justify-center text-xs font-mono font-bold text-primary">
                  2
                </span>
                <h3 className="font-bold text-charcoal-900 text-sm">
                  Acceptance Angle and Theoretical Numerical Aperture
                </h3>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed mb-4">
                The acceptance angle <MathFormula math="\theta_0" /> is the maximum semi-angle of the incident cone in air (<MathFormula math="n_0 = 1" />) for which light remains trapped within the core by total internal reflection. The Numerical Aperture represents the light gathering power of the fiber:
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded border border-borderline">
              <span className="text-[11px] font-semibold text-charcoal-600 block mb-1 font-mono">
                Theoretical Formula:
              </span>
              <MathFormula
                math="\text{NA} = \sin(\theta_0) = \sqrt{n_1^2 - n_2^2}"
                block
                className="text-center font-semibold"
              />
              <p className="text-[11px] text-center text-charcoal-500 font-mono mt-1">
                Acceptance Angle: &theta;0 = arcsin(NA)
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Experimental Measurement Formula */}
        <div className="lab-card p-6 bg-surface border border-borderline">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded bg-slate-100 border border-borderline flex items-center justify-center text-xs font-mono font-bold text-primary">
              3
            </span>
            <h3 className="font-bold text-charcoal-900 text-base">
              Laboratory Determination Formula for this Experiment
            </h3>
          </div>
          <p className="text-sm text-charcoal-700 leading-relaxed mb-4">
            Light emerges from the fiber tip into air in a diverging circular cone of half-angle <MathFormula math="\theta_0" />. When projected onto a screen placed at a perpendicular distance <MathFormula math="L" />, the illuminated spot forms a circular disc of diameter <MathFormula math="D" /> (spot radius <MathFormula math="r = D/2" />).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-borderline">
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-charcoal-700 font-mono mb-1">
                Experimental Numerical Aperture:
              </span>
              <MathFormula
                math="\text{NA} = \sin(\theta_0) = \frac{D/2}{\sqrt{L^2 + (D/2)^2}}"
                block
                className="text-primary font-bold text-lg"
              />
            </div>
            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-borderline pt-3 md:pt-0 md:pl-4 text-xs text-charcoal-700 space-y-1 font-mono">
              <p><strong className="text-charcoal-900">L:</strong> Distance between fiber tip and screen in cm</p>
              <p><strong className="text-charcoal-900">D:</strong> Spot diameter measured on concentric rings in cm</p>
              <p><strong className="text-charcoal-900">&theta;0:</strong> Acceptance semi-angle: &theta;0 = arcsin(NA) in degrees</p>
              <p><strong className="text-charcoal-900">2 * &theta;0:</strong> Full acceptance cone angle in degrees</p>
            </div>
          </div>
        </div>

        {/* Interactive Ray Diagram */}
        <TheoryRayDiagram />
      </div>
    </section>
  );
}
