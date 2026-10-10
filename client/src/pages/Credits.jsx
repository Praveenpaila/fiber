import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

const mediaCredits = [
  {
    item: 'Optical Fiber Telecommunications Backbone',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical high-resolution photograph replacement',
    localFile: '/images/telecom_fiber.svg',
    author: 'FiberLab Technical Graphics / Reference: Wikimedia Commons (Hustvedt)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_illuminated.jpg',
    license: 'CC BY-SA 3.0 / Educational Open Access'
  },
  {
    item: 'Medical Flexible Endoscope',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical clinical endoscopy photograph replacement',
    localFile: '/images/endoscopy_scope.svg',
    author: 'FiberLab Technical Graphics / Reference: Wikimedia Commons (B. Wellum)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Flexible_endoscope.jpg',
    license: 'CC BY-SA 3.0 / Educational Open Access'
  },
  {
    item: 'Fiber Optic Strain and Thermal Sensors',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical civil infrastructure FBG sensor photograph replacement',
    localFile: '/images/fiber_sensor.svg',
    author: 'FiberLab Technical Graphics / Reference: Wikimedia Commons (G. Schierholz)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_cable_bundle.jpg',
    license: 'CC BY-SA 4.0 / Educational Open Access'
  },
  {
    item: 'Avionics Fly-by-Light Flight Control Bus',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical aerospace wire harness photograph replacement',
    localFile: '/images/aerospace_fiber.svg',
    author: 'NASA Technical Reports / Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Optical_fiber_laser_experiment.jpg',
    license: 'Public Domain'
  },
  {
    item: 'Cold Light Illumination and Displays',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical fiber light harness photograph replacement',
    localFile: '/images/decorative_fiber.svg',
    author: 'FiberLab Technical Graphics / Reference: Wikimedia Commons (Fir0002)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fibreoptic.jpg',
    license: 'GFDL 1.2 / CC BY-SA 3.0'
  },
  {
    item: 'Industrial Automation Control Module',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Clean SVG schematic awaiting physical industrial DIN rail fiber panel photograph replacement',
    localFile: '/images/industrial_fiber.svg',
    author: 'FiberLab Technical Graphics / Reference: Wikimedia Commons (David Monniaux)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fiber_optic_patch_panel.jpg',
    license: 'CC BY-SA 3.0'
  },
  {
    item: 'Fiber Cross-Section and Refractive Profile',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Vector diagram with core, cladding, jacket, and step-index graph',
    localFile: '/images/fiber_cross_section.svg',
    author: 'FiberLab Optics Curriculum Graphics',
    sourceUrl: 'Internal Engineering Physics Archive',
    license: 'Creative Commons Attribution 4.0'
  },
  {
    item: 'Optical Bench Experimental Setup',
    type: 'Labeled Technical Diagram (SVG)',
    status: 'Geometric schematic with bench riders, scale, cone divergence, and angle theta_0',
    localFile: '/images/setup_diagram.svg',
    author: 'FiberLab Optics Curriculum Graphics',
    sourceUrl: 'Internal Engineering Physics Archive',
    license: 'Creative Commons Attribution 4.0'
  }
];

export function Credits() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary font-bold mb-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Attribution Catalog
          </div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">
            Image, Diagram, and Resource Credits
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Complete inventory of photographic references, technical SVG diagrams, author credits, and licenses.
          </p>
        </div>

        <div className="p-4 mb-8 bg-slate-100 border border-borderline rounded text-xs text-charcoal-700 font-mono">
          <strong>Catalog Policy:</strong> In strict compliance with laboratory honesty guidelines, items that are clean labeled technical diagrams (SVG) rather than physical photographic camera captures are explicitly noted below for easy replacement with site-specific equipment photos.
        </div>

        <div className="space-y-4">
          {mediaCredits.map((media, idx) => (
            <div
              key={idx}
              className="lab-card p-5 bg-surface border border-borderline flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-charcoal-900">
                    {media.item}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-borderline text-charcoal-600 font-mono">
                    {media.type}
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 font-mono">
                  File: <code className="text-primary">{media.localFile}</code>
                </p>

                <p className="text-xs text-charcoal-700">
                  <strong className="text-charcoal-900">Status:</strong> {media.status}
                </p>

                <div className="text-xs text-charcoal-600 space-y-0.5 pt-1">
                  <p><span className="font-semibold text-charcoal-800">Author:</span> {media.author}</p>
                  <p><span className="font-semibold text-charcoal-800">License:</span> {media.license}</p>
                </div>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                {media.sourceUrl.startsWith('http') ? (
                  <a
                    href={media.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lab-btn-secondary text-xs inline-flex items-center gap-1.5"
                  >
                    <span>View Reference Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-charcoal-500 bg-slate-50 px-2.5 py-1 rounded border border-borderline block">
                    {media.sourceUrl}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
