import React, { useState, useEffect } from 'react';
import api from '../../utils/apiClient';
import {
  ShieldAlert,
  Spline,
  Sparkles,
  Compass,
  SunDim,
  Ruler,
  HandMetal,
  PowerOff
} from 'lucide-react';

const fallbackPrecautions = [
  {
    order: 1,
    title: 'Laser Radiation Safety',
    description: 'Never look directly into the laser beam or into the fiber output end while the laser is powered on.',
    iconName: 'ShieldAlert',
    isLaserSafety: true
  },
  {
    order: 2,
    title: 'Avoid Sharp Bends',
    description: 'Keep the optical fiber straight with no sharp bends or kinks that induce high macrobending attenuation.',
    iconName: 'Spline',
    isLaserSafety: false
  },
  {
    order: 3,
    title: 'Clean Polished Tips',
    description: 'Clean fiber ends with optical tissue and do not touch the polished connector tip with bare fingers.',
    iconName: 'Sparkles',
    isLaserSafety: false
  },
  {
    order: 4,
    title: 'Perpendicular Alignment',
    description: 'Keep the fiber output tip strictly perpendicular to the flat surface of the projection screen.',
    iconName: 'Compass',
    isLaserSafety: false
  },
  {
    order: 5,
    title: 'Dim Room Lighting',
    description: 'Dim the room lights so the outer boundary of the circular laser spot is clearly distinguishable.',
    iconName: 'SunDim',
    isLaserSafety: false
  },
  {
    order: 6,
    title: 'Consistent Intensity Edge',
    description: 'Measure diameter D consistently from the same perimeter intensity threshold for each distance reading.',
    iconName: 'Ruler',
    isLaserSafety: false
  },
  {
    order: 7,
    title: 'Gentle Cable Handling',
    description: 'Handle the patch cable gently without twisting or pulling the connector strain relief boots.',
    iconName: 'HandMetal',
    isLaserSafety: false
  },
  {
    order: 8,
    title: 'Switch Off Between Sets',
    description: 'Switch off the laser source between reading sets to prevent semiconductor diode junction overheating.',
    iconName: 'PowerOff',
    isLaserSafety: true
  }
];

export function PrecautionsSection() {
  const [precautions, setPrecautions] = useState(fallbackPrecautions);

  useEffect(() => {
    api.get('/api/precautions')
      .then(res => {
        if (res.data?.success && res.data.data?.length > 0) {
          setPrecautions(res.data.data);
        }
      })
      .catch(() => {
        // Retain fallback data
      });
  }, []);

  const renderIcon = (name, isLaserSafety) => {
    const props = { className: `w-5 h-5 shrink-0 ${isLaserSafety ? 'text-laser' : 'text-primary'}` };
    switch (name) {
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Spline':
        return <Spline {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'SunDim':
        return <SunDim {...props} />;
      case 'Ruler':
        return <Ruler {...props} />;
      case 'HandMetal':
        return <HandMetal {...props} />;
      case 'PowerOff':
        return <PowerOff {...props} />;
      default:
        return <ShieldAlert {...props} />;
    }
  };

  return (
    <section id="precautions" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          8. Laboratory Safety Precautions (8 Rules)
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Strict optical and electrical precautions required for experimental precision and personal safety.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {precautions.map((p) => (
          <div
            key={p.order}
            className={`lab-card p-4 bg-surface border transition-colors ${
              p.isLaserSafety
                ? 'border-red-300 bg-red-50/20'
                : 'border-borderline'
            }`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div
                className={`p-2 rounded border ${
                  p.isLaserSafety
                    ? 'bg-laser-light border-red-200'
                    : 'bg-slate-100 border-borderline'
                }`}
              >
                {renderIcon(p.iconName, p.isLaserSafety)}
              </div>
              <div>
                <span className="text-[10px] font-mono text-charcoal-500 uppercase tracking-wider block">
                  Rule {p.order} {p.isLaserSafety ? ': Laser Safety' : ''}
                </span>
                <h3 className="font-bold text-xs text-charcoal-900">
                  {p.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-charcoal-700 leading-relaxed pt-1">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
