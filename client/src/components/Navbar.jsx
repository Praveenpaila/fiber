import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';

const navLinks = [
  { label: 'Aim', href: '#aim' },
  { label: 'Apparatus', href: '#apparatus' },
  { label: 'Setup', href: '#setup' },
  { label: 'Theory', href: '#theory' },
  { label: 'Procedure', href: '#procedure' },
  { label: 'Observations', href: '#observations' },
  { label: 'Result', href: '#result' },
  { label: 'Precautions', href: '#precautions' },
  { label: 'Applications', href: '#applications' },
  { label: 'Quiz', href: '#quiz' }
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-borderline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo and Title */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-charcoal-900 tracking-tight">FiberLab</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-charcoal-500 font-mono">
                Numerical Aperture Simulator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isHomePage ? (
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-2.5 py-1.5 text-xs font-medium text-charcoal-700 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : (
            <nav className="hidden sm:flex items-center space-x-4">
              <Link
                to="/"
                className="text-xs font-medium text-primary hover:underline"
              >
                Return to Laboratory
              </Link>
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-charcoal-700 hover:bg-slate-100 border border-borderline"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && isHomePage && (
        <div className="lg:hidden border-t border-borderline bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-xs font-medium text-charcoal-800 hover:bg-slate-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
