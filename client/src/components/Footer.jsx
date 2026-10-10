import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-borderline mt-16 text-xs text-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-bold text-sm text-charcoal-900 mb-2">FiberLab Virtual Physics Laboratory</h5>
            <p className="text-charcoal-600 leading-relaxed mb-3">
              Standardized engineering experiment module for determining the Numerical Aperture (NA) and Acceptance Angle of an optical fiber.
            </p>
            <div className="font-mono text-[11px] text-charcoal-500 bg-slate-50 p-2.5 rounded border border-borderline">
              Course: Engineering Physics Laboratory (Optics)<br />
              Target Level: Undergraduate B.Tech / B.E. Physics
            </div>
          </div>

          <div>
            <h5 className="font-bold text-sm text-charcoal-900 mb-2">Student and Academic Details</h5>
            <div className="space-y-1.5 text-charcoal-600">
              <p><span className="font-medium text-charcoal-800">Student Roll No:</span> [Student roll number placeholder]</p>
              <p><span className="font-medium text-charcoal-800">Institution:</span> [Department of Physics, Engineering College]</p>
              <p><span className="font-medium text-charcoal-800">Experiment ID:</span> PHY-EXP-08 (Optical Fiber NA)</p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-sm text-charcoal-900 mb-2">Legal and Attribution</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
                <span className="block text-[11px] text-charcoal-500">Student observation data storage and purge details</span>
              </li>
              <li>
                <Link to="/terms" className="text-primary hover:underline font-medium">
                  Terms and Conditions
                </Link>
                <span className="block text-[11px] text-charcoal-500">Educational use license and disclaimer</span>
              </li>
              <li>
                <Link to="/credits" className="text-primary hover:underline font-medium">
                  Image and Source Credits
                </Link>
                <span className="block text-[11px] text-charcoal-500">Wikimedia Commons and diagram license index</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-borderline flex flex-col sm:flex-row items-center justify-between text-[11px] text-charcoal-500 gap-2">
          <p>&copy; {new Date().getFullYear()} FiberLab. Educational physics simulation for engineering students.</p>
          <p>Designed for academic laboratory curriculum compliance.</p>
        </div>
      </div>
    </footer>
  );
}
