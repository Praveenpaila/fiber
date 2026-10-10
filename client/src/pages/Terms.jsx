import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pre-Launch Review Notice */}
        <div className="p-4 mb-8 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 font-mono">
          <strong>Notice for System Administrator:</strong> These Terms and Conditions govern the educational operation of FiberLab. They should be formally reviewed and approved by institutional legal counsel or the laboratory director before public release.
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-bold mb-2">
            <FileText className="w-4 h-4 text-primary" />
            Legal Terms
          </div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm text-charcoal-600 mt-1 font-mono">
            Effective Date: October 10, 2026 | Version 1.0
          </p>
        </div>

        <div className="lab-card p-6 sm:p-8 bg-surface border border-borderline space-y-6 text-xs text-charcoal-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              1. Permitted Educational Use
            </h2>
            <p>
              FiberLab is provided solely for non-commercial educational instruction, student self-study, and laboratory preparation in college-level physics and engineering courses. Students and faculty are granted permission to access the 3D models, simulation engine, and report generation tools for academic coursework.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              2. Scientific Disclaimer and No Warranty on Results
            </h2>
            <p>
              The simulations, formulas, and 3D renderings within FiberLab are mathematical approximations designed to illustrate fundamental optical principles. While calculations adhere to standard Snell's law formulations, this software is provided on an &quot;as-is&quot; basis without warranty of any kind. FiberLab cannot guarantee that virtual results will match physical bench tolerances or experimental artifacts resulting from component misalignments in a physical lab.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              3. Content and Intellectual Property Rights
            </h2>
            <p>
              The underlying software code, 3D procedural geometries, and curriculum text are licensed under academic open-access terms. Photographic works, reference diagrams, and external media are attributed to their respective authors under Creative Commons and public domain designations as cataloged on the Image and Source Credits page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              4. Student Laboratory Reports
            </h2>
            <p>
              Generated laboratory PDF documents are provided to assist students with lab record compliance. Students remain strictly bound by their respective institutions&apos; honor codes and academic integrity policies regarding data veracity and physical lab verification.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
