import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ListOrdered } from 'lucide-react';

const steps = [
  {
    stepNumber: 1,
    title: 'Arrange Apparatus on Bench',
    desc: 'Arrange laser, fiber holder, and screen in a straight line on the bench.',
    notes: 'Verify that all component riders are seated squarely on the twin guide rails and locked firmly.'
  },
  {
    stepNumber: 2,
    title: 'Clean and Connect Fiber',
    desc: 'Clean both fiber ends: connect one end to the laser output.',
    notes: 'Use lint-free optical lens tissue. Avoid touching polished connector ferrules with fingers.'
  },
  {
    stepNumber: 3,
    title: 'Clamp Free End Perpendicularly',
    desc: 'Fix the free end in the holder, facing the screen, perpendicular to it.',
    notes: 'Tighten the knurled V-clamp thumbscrew gently to avoid crushing the fiber core.'
  },
  {
    stepNumber: 4,
    title: 'Power On Laser and Center Spot',
    desc: 'Switch on the laser: a circular spot appears on the screen.',
    notes: 'Adjust the vertical collar height so the red spot is centered on the cross-hair.'
  },
  {
    stepNumber: 5,
    title: 'Set Initial Distance L',
    desc: 'Set the first distance L between fiber end and screen.',
    notes: 'Position the screen at L = 2.0 cm using the millimeter graduated bench scale.'
  },
  {
    stepNumber: 6,
    title: 'Measure Spot Diameter D',
    desc: 'Measure the spot diameter D (horizontal and vertical, take the mean).',
    notes: 'Measure along both orthogonal axes using the concentric millimeter graduation rings.'
  },
  {
    stepNumber: 7,
    title: 'Repeat for Increasing Distances',
    desc: 'Increase L in equal steps and repeat.',
    notes: 'Record measurements for at least five distinct distances (such as 2, 3, 4, 5, and 6 cm).'
  },
  {
    stepNumber: 8,
    title: 'Calculate NA for Every Reading',
    desc: 'Calculate NA for every reading, then the average.',
    notes: 'Apply NA = (D / 2) / sqrt(L^2 + (D / 2)^2) for each row and take the arithmetic mean.'
  },
  {
    stepNumber: 9,
    title: 'Calculate Acceptance Angle',
    desc: 'Calculate the acceptance angle from the average NA.',
    notes: 'Compute theta_0 = arcsin(average NA) and full acceptance cone 2 * theta_0 in degrees.'
  }
];

export function ProcedureSection() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section id="procedure" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          5. Laboratory Procedure (9 Steps)
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Follow the step-by-step procedure in sequential order to conduct the experiment accurately.
        </p>
      </div>

      <div className="lab-card p-6 sm:p-8 bg-surface border border-borderline">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span className="font-semibold text-primary">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-200 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step Pill Buttons */}
          <div className="grid grid-cols-9 gap-1.5 mt-3">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`py-1.5 text-xs font-mono font-semibold rounded text-center border transition-colors ${
                  idx === currentStep
                    ? 'bg-primary text-white border-primary'
                    : idx < currentStep
                    ? 'bg-slate-100 text-charcoal-800 border-borderline hover:bg-slate-200'
                    : 'bg-white text-charcoal-400 border-borderline hover:bg-slate-50'
                }`}
                title={`Go to Step ${s.stepNumber}`}
              >
                {s.stepNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Step Card */}
        <div className="p-6 bg-slate-50 border border-borderline rounded mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center font-bold font-mono text-lg shrink-0">
              {steps[currentStep].stepNumber}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-charcoal-900">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-charcoal-800 leading-relaxed font-medium">
                {steps[currentStep].desc}
              </p>
              <div className="pt-2 text-xs text-charcoal-600 font-mono bg-white p-3 rounded border border-borderline">
                <span className="font-semibold text-primary block mb-0.5">Procedural Guideline:</span>
                {steps[currentStep].notes}
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-borderline">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`lab-btn-secondary ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </button>

          <span className="text-xs text-charcoal-500 font-mono hidden sm:inline-block">
            Keyboard navigation: Click step numbers above to jump
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`lab-btn-primary ${currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
