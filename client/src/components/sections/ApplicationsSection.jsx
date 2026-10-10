import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe2 } from 'lucide-react';

const fallbackApplications = [
  {
    order: 1,
    title: 'Optical Fiber Communication and Internet Backbone',
    description: 'High capacity undersea and terrestrial glass fiber cables transmit digital voice, video, and data across continents with minimal optical attenuation.',
    whyNaMatters: 'A controlled numerical aperture balances light gathering efficiency with low modal dispersion to sustain multi-gigabit data transmission rates.',
    imagePath: '/images/telecom_fiber.svg',
    sourceInfo: {
      author: 'Wikimedia Commons / Hustvedt',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    order: 2,
    title: 'Medical Endoscopy and Arthroscopy',
    description: 'Flexible coherent fiber bundles deliver high intensity illumination and return high resolution optical images from internal body cavities during surgeries.',
    whyNaMatters: 'A high numerical aperture collects diffuse reflected light from internal tissue, providing brighter clinical imagery inside tight cavities.',
    imagePath: '/images/endoscopy_scope.svg',
    sourceInfo: {
      author: 'Wikimedia Commons / B. Wellum',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    order: 3,
    title: 'Fiber Optic Sensors in Civil Infrastructure',
    description: 'Optical fibers embedded inside bridges, dams, and tunnels monitor structural strain, temperature variations, and acoustic events in real time.',
    whyNaMatters: 'Specific numerical aperture values ensure stable light coupling into Fiber Bragg Gratings and interferometric sensing zones.',
    imagePath: '/images/fiber_sensor.svg',
    sourceInfo: {
      author: 'Wikimedia Commons / G. Schierholz',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    order: 4,
    title: 'Defense and Aerospace Communication',
    description: 'Fly-by-light flight control links and naval communication buses utilize fiber optics because glass conductors are immune to electromagnetic interference (EMI).',
    whyNaMatters: 'Tightly controlled numerical aperture fibers maintain coupling stability under intense mechanical vibration and thermal extremes.',
    imagePath: '/images/aerospace_fiber.svg',
    sourceInfo: {
      author: 'NASA / Wikimedia Commons',
      license: 'Public Domain'
    }
  },
  {
    order: 5,
    title: 'Illumination and Decorative Lighting',
    description: 'Optical fibers guide bright light from remote illuminators to display cabinets and architectural landmarks without carrying heat or electrical current.',
    whyNaMatters: 'A wide acceptance angle enables high optical coupling efficiency from broad halogen or solid-state LED light engines.',
    imagePath: '/images/decorative_fiber.svg',
    sourceInfo: {
      author: 'Wikimedia Commons / Fir0002',
      license: 'GFDL 1.2 / CC BY-SA 3.0'
    }
  },
  {
    order: 6,
    title: 'Industrial Inspection and Factory Data Networks',
    description: 'Optical fibers carry sensor telemetry and video feeds through harsh industrial manufacturing cells containing heavy electromagnetic motors.',
    whyNaMatters: 'Optimized numerical aperture values permit forgiving connector alignment in dusty, vibrating industrial environments.',
    imagePath: '/images/industrial_fiber.svg',
    sourceInfo: {
      author: 'Wikimedia Commons / David Monniaux',
      license: 'CC BY-SA 3.0'
    }
  }
];

export function ApplicationsSection() {
  const [apps, setApps] = useState(fallbackApplications);

  useEffect(() => {
    axios.get('/api/applications')
      .then(res => {
        if (res.data?.success && res.data.data?.length > 0) {
          // ensure imagePath points to .svg or .jpg properly
          const formatted = res.data.data.map(d => ({
            ...d,
            imagePath: d.imagePath.replace('.jpg', '.svg')
          }));
          setApps(formatted);
        }
      })
      .catch(() => {
        // Keep fallback data
      });
  }, []);

  return (
    <section id="applications" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          9. Engineering Applications of Optical Fibers
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Real-world implementations where Numerical Aperture dictates optical coupling and performance.
        </p>
      </div>

      {/* Note on why NA matters */}
      <div className="lab-card p-5 bg-surface border border-borderline mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shrink-0">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-charcoal-900 mb-1">
              Engineering Rationale: Why Numerical Aperture Matters
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              The numerical aperture dictates the light-gathering capacity and coupling efficiency of an optical fiber to optical sources (lasers and LEDs). A larger numerical aperture accepts more incident light from wide-angle emitters, making physical connector alignment easier. However, higher numerical aperture values increase modal dispersion in multimode fibers because higher-order modes traverse longer zig-zag path lengths, thereby reducing signal transmission bandwidth over long telecommunication distances.
            </p>
          </div>
        </div>
      </div>

      {/* Application Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div
            key={app.order}
            className="lab-card bg-surface border border-borderline overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Container */}
              <div className="w-full h-44 bg-slate-100 border-b border-borderline overflow-hidden">
                <img
                  src={app.imagePath}
                  alt={app.title}
                  className="w-full h-full object-cover block"
                  loading="lazy"
                />
              </div>

              {/* Text Information */}
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-charcoal-900 leading-snug">
                  {app.title}
                </h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  {app.description}
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded border border-borderline text-[11px] text-charcoal-600 font-mono">
                  <span className="font-semibold text-primary block mb-0.5">Role of NA:</span>
                  {app.whyNaMatters}
                </div>
              </div>
            </div>

            {/* Attribution note */}
            <div className="px-4 py-2 border-t border-borderline bg-slate-50 text-[10px] text-charcoal-500 font-mono flex items-center justify-between">
              <span>Source: {app.sourceInfo?.author || 'Technical schematic'}</span>
              <span>{app.sourceInfo?.license || 'CC License'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
