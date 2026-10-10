import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Compass, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full lab-card p-8 bg-surface border border-borderline">
          <div className="w-12 h-12 rounded bg-slate-100 border border-borderline flex items-center justify-center mx-auto mb-4 text-primary">
            <Compass className="w-6 h-6" />
          </div>

          <h1 className="text-3xl font-bold font-mono text-charcoal-900 mb-2">
            404
          </h1>
          <h2 className="text-base font-bold text-charcoal-800 mb-2">
            Experimental Station Not Found
          </h2>
          <p className="text-xs text-charcoal-600 mb-6 leading-relaxed">
            The requested laboratory page or URL does not exist on this simulation server. Please return to the primary laboratory bench.
          </p>

          <Link to="/" className="lab-btn-primary text-xs py-2 px-4 w-full justify-center">
            <Home className="w-4 h-4 mr-1.5" />
            Return to Laboratory
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
