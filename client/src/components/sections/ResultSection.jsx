import React, { useState } from 'react';
import { Download, Award, Calculator, CheckCircle2 } from 'lucide-react';
import { computePercentageError } from '../../utils/physics';
import { generateLabReportPdf } from '../../utils/pdfGenerator';

export function ResultSection({ experimentData }) {
  const [theoreticalNA, setTheoreticalNA] = useState('0.384');

  const averageNA = experimentData?.averageNA || 0.371;
  const acceptanceAngle = experimentData?.acceptanceAngle || 21.8;
  const acceptanceCone = experimentData?.acceptanceCone || 43.6;
  const rows = experimentData?.rows || [];
  const studentName = experimentData?.studentName || '';
  const rollNo = experimentData?.rollNo || '';

  const percentageError = computePercentageError(averageNA, theoreticalNA);

  const handleDownloadPdf = () => {
    generateLabReportPdf({
      studentName,
      rollNo,
      rows,
      averageNA,
      acceptanceAngle,
      acceptanceCone,
      theoreticalNA: theoreticalNA ? parseFloat(theoreticalNA) : null,
      percentageError
    });
  };

  return (
    <section id="result" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          7. Experimental Results and Lab Report
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Final statistical parameters derived from the observation table and standardized report export.
        </p>
      </div>

      <div className="space-y-6">
        {/* Highlight Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="lab-card p-5 bg-surface border border-borderline">
            <span className="text-xs text-charcoal-500 font-mono block mb-1">
              Average Numerical Aperture (NA)
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">
              {Number(averageNA).toFixed(3)}
            </div>
            <span className="text-[11px] text-charcoal-500 font-mono mt-1 block">
              Dimensionless light gathering capacity
            </span>
          </div>

          <div className="lab-card p-5 bg-surface border border-borderline">
            <span className="text-xs text-charcoal-500 font-mono block mb-1">
              Acceptance Semi-Angle (&theta;0)
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal-900">
              {Number(acceptanceAngle).toFixed(2)}&deg;
            </div>
            <span className="text-[11px] text-charcoal-500 font-mono mt-1 block">
              &theta;0 = arcsin(average NA)
            </span>
          </div>

          <div className="lab-card p-5 bg-surface border border-borderline">
            <span className="text-xs text-charcoal-500 font-mono block mb-1">
              Full Acceptance Cone (2 &times; &theta;0)
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal-900">
              {Number(acceptanceCone).toFixed(2)}&deg;
            </div>
            <span className="text-[11px] text-charcoal-500 font-mono mt-1 block">
              Apex vertex divergence angle
            </span>
          </div>
        </div>

        {/* Theoretical Comparison and Percentage Error */}
        <div className="lab-card p-6 bg-surface border border-borderline">
          <h3 className="text-sm font-bold text-charcoal-900 mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            Theoretical Comparison and Error Estimation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-5">
              <label htmlFor="theo-na-input" className="block text-xs font-semibold text-charcoal-700 mb-1">
                Theoretical NA (e.g. sqrt(n1&sup2; - n2&sup2;)):
              </label>
              <input
                id="theo-na-input"
                type="number"
                step="0.001"
                min="0.01"
                max="1.0"
                value={theoreticalNA}
                onChange={e => setTheoreticalNA(e.target.value)}
                placeholder="e.g. 0.384"
                className="w-full px-3 py-1.5 bg-white border border-borderline rounded text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="text-[11px] text-charcoal-500 block mt-1">
                Standard step-index fiber with n1=1.50 and n2=1.45 has NA = 0.384.
              </span>
            </div>

            <div className="sm:col-span-7 bg-slate-50 p-4 rounded border border-borderline">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-charcoal-700">Percentage Error:</span>
                <span className="text-sm font-bold text-primary">
                  {percentageError !== null ? `${percentageError}%` : 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 font-mono mt-1">
                Formula: |Experimental NA - Theoretical NA| / Theoretical NA &times; 100%
              </p>
            </div>
          </div>
        </div>

        {/* Formal Lab Result Sentence and PDF Generator */}
        <div className="lab-card p-6 bg-surface border border-borderline">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-primary block uppercase tracking-wider mb-1">
                Formal Conclusion Statement
              </span>
              <p className="text-base sm:text-lg font-semibold text-charcoal-900 leading-snug">
                The average numerical aperture of the given optical fiber is{' '}
                <span className="font-mono text-primary font-bold">{Number(averageNA).toFixed(3)}</span>{' '}
                and its acceptance angle is{' '}
                <span className="font-mono text-primary font-bold">{Number(acceptanceAngle).toFixed(2)}</span>{' '}
                degrees.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-borderline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-charcoal-600 font-mono">
              Export format: Standard academic laboratory report (A4 PDF). Includes student credentials, apparatus, formulas, observation table, results, and safety precautions.
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="lab-btn-primary shrink-0 text-xs py-2 px-4"
            >
              <Download className="w-4 h-4 text-white" />
              Download lab report (PDF)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
