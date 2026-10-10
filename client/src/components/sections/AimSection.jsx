import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';

export function AimSection() {
  return (
    <section id="aim" className="py-12 border-b border-borderline">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 border border-borderline text-xs font-mono text-charcoal-700 mb-4">
          Virtual Physics Lab: Experiment 08
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 tracking-tight leading-snug mb-4">
          Numerical Aperture of an Optical Fiber. Measure the spot size at different distances, calculate NA for each reading, and get the average NA and acceptance angle.
        </h1>
        <p className="text-base sm:text-lg text-charcoal-700 max-w-2xl mx-auto font-medium mb-6">
          Aim: To determine the numerical aperture and acceptance angle of a given optical fiber.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#apparatus"
            className="lab-btn-secondary"
          >
            <Eye className="w-4 h-4 text-charcoal-700" />
            View apparatus
          </a>
          <a
            href="#observations"
            className="lab-btn-primary"
          >
            Start the experiment
            <ArrowRight className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Optical Fiber Fundamentals and Cross-Section */}
      <div className="lab-card p-6 sm:p-8 bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-charcoal-900">
              Understanding the Optical Fiber Structure
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              An optical fiber is a cylindrical dielectric waveguide consisting of a central high-index core enclosed by a lower-index cladding layer and outer protective jackets. Light introduced into the core at an incident angle smaller than the acceptance angle undergoes total internal reflection (TIR) at the core-cladding interface and propagates with negligible leakage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-borderline rounded">
                <span className="font-mono text-xs font-semibold text-primary block mb-1">1. Glass Core (n1)</span>
                <p className="text-xs text-charcoal-600">
                  Denser medium (n1 ≈ 1.50). Transmits the propagating light rays through consecutive total internal reflections.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-borderline rounded">
                <span className="font-mono text-xs font-semibold text-primary block mb-1">2. Cladding Layer (n2)</span>
                <p className="text-xs text-charcoal-600">
                  Rarer medium (n2 ≈ 1.45, where n1 &gt; n2). Keeps optical rays confined strictly within the core boundary.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-borderline rounded">
                <span className="font-mono text-xs font-semibold text-primary block mb-1">3. Outer Jacket</span>
                <p className="text-xs text-charcoal-600">
                  Polymer protective jacket. Provides mechanical isolation, tensile strength, and environmental protection.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-borderline rounded p-2">
              <img
                src="/images/fiber_cross_section.svg"
                alt="Labeled technical cross-section schematic of an optical fiber core and cladding"
                className="w-full h-auto block rounded"
              />
              <p className="text-center text-[11px] text-charcoal-500 font-mono mt-2">
                Figure 1: Cross-sectional geometry and step-index profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
