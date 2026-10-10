import React, { useState } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export function Privacy() {
  const [purgeRollNo, setPurgeRollNo] = useState('');
  const [purgeStatus, setPurgeStatus] = useState({ state: 'idle', message: '' });

  const handlePurgeRequest = async (e) => {
    e.preventDefault();
    if (!purgeRollNo.trim()) return;

    setPurgeStatus({ state: 'loading', message: 'Purging observation records...' });
    try {
      const res = await axios.delete(`/api/observations/purge-by-roll/${encodeURIComponent(purgeRollNo.trim())}`);
      if (res.data?.success) {
        setPurgeStatus({
          state: 'success',
          message: `Purge completed: ${res.data.deletedCount} observation record(s) removed from MongoDB.`
        });
        setPurgeRollNo('');
      }
    } catch (err) {
      setPurgeStatus({
        state: 'error',
        message: err.response?.data?.message || 'Failed to purge records.'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pre-Launch Review Notice */}
        <div className="p-4 mb-8 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 font-mono">
          <strong>Notice for System Administrator:</strong> This Privacy Policy accurately describes the current data collection architecture of FiberLab. It should be formally reviewed and approved by the institutional website owner prior to institutional domain launch.
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-bold mb-2">
            <Shield className="w-4 h-4 text-primary" />
            Institutional Compliance
          </div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-charcoal-600 mt-1 font-mono">
            Effective Date: October 10, 2026 | Version 1.0
          </p>
        </div>

        <div className="lab-card p-6 sm:p-8 bg-surface border border-borderline space-y-6 text-xs text-charcoal-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              1. Information We Collect and Store
            </h2>
            <p>
              FiberLab is an educational laboratory simulation created for physics students and instructors. When you save laboratory observations to the MongoDB database, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-charcoal-800">
              <li>Student Name (entered by the user)</li>
              <li>Student Roll Number (entered by the user)</li>
              <li>Experimental readings: distance L, spot diameter D, and derived numerical aperture calculations</li>
              <li>Timestamp of observation creation</li>
            </ul>
            <p>
              We do not collect passwords, email addresses, payment information, physical locations, or device identifiers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              2. Absence of Advertising Trackers and Cookies
            </h2>
            <p>
              This website employs zero advertising trackers, third-party analytics pixels, behavioral tracking scripts, or profiling cookies. No user data is ever sold, transferred, or shared with commercial entities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              3. Data Retention Period
            </h2>
            <p>
              Observation records stored in MongoDB are retained for the duration of the academic semester (approximately 180 days) to allow students to retrieve and verify their laboratory data. Records older than 180 days are periodically purged during database maintenance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal-900">
              4. How to Request or Execute Immediate Data Deletion
            </h2>
            <p>
              Students and instructors maintain complete ownership over their submitted records. You can delete your records at any time through two methods:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                <strong>Self-Service Table Action:</strong> Search your roll number on the Observation Table section of the main laboratory page and click the red trash icon next to any observation entry.
              </li>
              <li>
                <strong>Immediate Roll Number Purge:</strong> Use the automated purge form below to immediately delete all database entries associated with your roll number.
              </li>
            </ol>
          </section>

          {/* Interactive Purge Form */}
          <div className="p-4 bg-slate-50 border border-borderline rounded mt-4">
            <h3 className="font-bold text-xs text-charcoal-900 mb-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-laser" />
              Automated Data Deletion Request (Purge by Roll Number)
            </h3>
            <form onSubmit={handlePurgeRequest} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={purgeRollNo}
                onChange={e => setPurgeRollNo(e.target.value)}
                placeholder="Enter Student Roll Number to Purge"
                className="flex-1 px-3 py-1.5 bg-white border border-borderline rounded text-xs font-mono"
                required
              />
              <button
                type="submit"
                disabled={purgeStatus.state === 'loading'}
                className="lab-btn-danger text-xs py-1.5 px-3"
              >
                Purge All Records
              </button>
            </form>

            {purgeStatus.message && (
              <p className={`mt-2 text-xs font-mono ${purgeStatus.state === 'success' ? 'text-emerald-700' : 'text-laser'}`}>
                {purgeStatus.message}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
