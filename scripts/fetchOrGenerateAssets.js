const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'client', 'public', 'images');
fs.mkdirSync(targetDir, { recursive: true });

// Technical SVG diagrams with clean engineering labels
const diagrams = {
  fiber_cross_section: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <rect width="600" height="400" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="300" y="32" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#0f172a">Optical Fiber Cross-Section and Refractive Index Profile</text>
  
  <!-- Outer Protective Jacket -->
  <circle cx="200" cy="210" r="140" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
  <!-- Primary Buffer / Cladding Coating -->
  <circle cx="200" cy="210" r="100" fill="#cbd5e1" stroke="#334155" stroke-width="1.5" />
  <!-- Cladding Layer (n2) -->
  <circle cx="200" cy="210" r="65" fill="#f1f5f9" stroke="#0284c7" stroke-width="2" />
  <!-- Core Layer (n1, denser) -->
  <circle cx="200" cy="210" r="28" fill="#0369a1" stroke="#0c4a6e" stroke-width="2" />
  <!-- Central laser light ray -->
  <circle cx="200" cy="210" r="8" fill="#dc2626" />

  <!-- Labels on left and right -->
  <!-- Core Callout -->
  <line x1="200" y1="210" x2="380" y2="120" stroke="#0369a1" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="380" y="105" width="190" height="30" rx="4" fill="#ffffff" stroke="#0369a1" stroke-width="1"/>
  <text x="390" y="125" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0369a1">Core (n1 = 1.50, Dia = 50 um)</text>

  <!-- Cladding Callout -->
  <line x1="245" y1="165" x2="380" y2="170" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="380" y="155" width="190" height="30" rx="4" fill="#ffffff" stroke="#0284c7" stroke-width="1"/>
  <text x="390" y="175" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0284c7">Cladding (n2 = 1.45, Dia = 125 um)</text>

  <!-- Buffer / Jacket Callout -->
  <line x1="270" y1="120" x2="380" y2="220" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="380" y="205" width="190" height="30" rx="4" fill="#ffffff" stroke="#475569" stroke-width="1"/>
  <text x="390" y="225" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#334155">Protective Jacket (Dia = 250 um)</text>

  <!-- Index Step Profile Graph -->
  <line x1="390" y1="340" x2="560" y2="340" stroke="#475569" stroke-width="1.5"/>
  <line x1="475" y1="270" x2="475" y2="350" stroke="#475569" stroke-width="1.5"/>
  <path d="M 410 320 L 450 320 L 450 280 L 500 280 L 500 320 L 540 320" fill="none" stroke="#0369a1" stroke-width="2"/>
  <text x="475" y="370" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#475569">Step-Index Profile: n1 &gt; n2</text>
</svg>`,

  setup_diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="400" y="35" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#0f172a">Experimental Bench Setup for Numerical Aperture Measurement</text>
  
  <!-- Optical Bench Rail -->
  <rect x="50" y="340" width="700" height="24" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
  <line x1="50" y1="352" x2="750" y2="352" stroke="#94a3b8" stroke-width="1" stroke-dasharray="8 4"/>
  <text x="400" y="385" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#475569">Aluminum Optical Bench with Metric Scale (100 cm)</text>

  <!-- 1. Laser Source on Rider -->
  <rect x="80" y="300" width="60" height="40" rx="4" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
  <rect x="70" y="220" width="80" height="80" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <rect x="140" y="250" width="16" height="20" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1"/>
  <circle cx="152" cy="260" r="4" fill="#dc2626"/>
  <text x="110" y="210" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0f172a">1. Laser Source (650 nm)</text>

  <!-- Fiber Cable from Laser to Clamp -->
  <path d="M 152 260 C 220 260, 210 170, 280 170 C 350 170, 320 260, 390 260" fill="none" stroke="#0284c7" stroke-width="5"/>
  <path d="M 152 260 C 220 260, 210 170, 280 170 C 350 170, 320 260, 390 260" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="280" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0369a1">2. Optical Fiber Patch Cord</text>

  <!-- 3. Fiber Holder V-Clamp on Rider -->
  <rect x="370" y="300" width="50" height="40" rx="4" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
  <rect x="388" y="240" width="14" height="60" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
  <rect x="382" y="245" width="26" height="30" rx="4" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
  <text x="395" y="210" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0f172a">3. Fiber Holder (V-Clamp)</text>

  <!-- Fiber Output Tip -->
  <rect x="400" y="257" width="14" height="6" fill="#0369a1"/>
  <line x1="414" y1="260" x2="414" y2="260" stroke="#dc2626" stroke-width="4"/>

  <!-- Emitted Light Cone -->
  <polygon points="414,260 660,160 660,360" fill="#dc2626" fill-opacity="0.12" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 2"/>
  <line x1="414" y1="260" x2="660" y2="260" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="2 2"/>

  <!-- 4. Screen on Rider -->
  <rect x="635" y="300" width="50" height="40" rx="4" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
  <rect x="655" y="130" width="10" height="170" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
  <text x="660" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0f172a">4. Target Screen</text>

  <!-- Spot on Screen -->
  <ellipse cx="660" cy="260" rx="2" ry="100" fill="#dc2626"/>
  <line x1="660" y1="160" x2="660" y2="360" stroke="#b91c1c" stroke-width="3"/>

  <!-- Dimension L (Distance) -->
  <line x1="414" y1="285" x2="660" y2="285" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="414" y1="278" x2="414" y2="292" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="660" y1="278" x2="660" y2="292" stroke="#0f172a" stroke-width="1.5"/>
  <rect x="515" y="272" width="45" height="22" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <text x="537" y="287" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="#0f172a">L</text>

  <!-- Dimension D (Diameter) -->
  <line x1="685" y1="160" x2="685" y2="360" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="678" y1="160" x2="692" y2="160" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="678" y1="360" x2="692" y2="360" stroke="#0f172a" stroke-width="1.5"/>
  <rect x="696" y="250" width="70" height="22" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <text x="731" y="265" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="#0f172a">Spot D</text>

  <!-- Angle theta_0 label -->
  <path d="M 480 260 A 66 66 0 0 0 472 235" fill="none" stroke="#0369a1" stroke-width="1.5"/>
  <text x="495" y="250" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="#0369a1">&theta;0</text>
</svg>`
};

// Write SVGs
fs.writeFileSync(path.join(targetDir, 'fiber_cross_section.svg'), diagrams.fiber_cross_section);
fs.writeFileSync(path.join(targetDir, 'setup_diagram.svg'), diagrams.setup_diagram);

// Real images for applications: create labeled high-precision SVGs or download real photos
// To guarantee 100% reliability, sharp rendering, and no broken links without relying on external CDNs or network rate limits,
// we provide clean labeled technical SVGs and high fidelity visuals locally.
const appVisuals = [
  {
    name: 'telecom_fiber.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#0f172a"/>
      <path d="M 0 320 C 150 320, 250 180, 600 80" fill="none" stroke="#0284c7" stroke-width="8" opacity="0.7"/>
      <path d="M 0 340 C 180 340, 280 200, 600 120" fill="none" stroke="#38bdf8" stroke-width="6" opacity="0.8"/>
      <path d="M 0 300 C 140 300, 220 150, 600 50" fill="none" stroke="#f43f5e" stroke-width="5" opacity="0.8"/>
      <path d="M 0 360 C 200 360, 300 230, 600 160" fill="none" stroke="#0ea5e9" stroke-width="7" opacity="0.9"/>
      <circle cx="480" cy="100" r="12" fill="#ffffff"/>
      <circle cx="480" cy="100" r="24" fill="#38bdf8" opacity="0.4"/>
      <circle cx="530" cy="140" r="10" fill="#ffffff"/>
      <rect x="24" y="24" width="380" height="52" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Optical Fiber Telecommunications Backbone</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Subsea and terrestrial dense wavelength division multiplexing (DWDM)</text>
    </svg>`
  },
  {
    name: 'endoscopy_scope.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#1e293b"/>
      <!-- Flexible catheter probe tube -->
      <path d="M 50 360 C 200 360, 350 280, 420 180 C 460 120, 520 100, 560 100" fill="none" stroke="#475569" stroke-width="32" stroke-linecap="round"/>
      <path d="M 50 360 C 200 360, 350 280, 420 180 C 460 120, 520 100, 560 100" fill="none" stroke="#64748b" stroke-width="26" stroke-linecap="round"/>
      <!-- Internal coherent fiber channel emitting bright white light -->
      <circle cx="560" cy="100" r="18" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="560" cy="100" r="10" fill="#ffffff"/>
      <polygon points="560,100 600,60 600,140" fill="#ffffff" opacity="0.3"/>
      <rect x="24" y="24" width="320" height="52" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Medical Flexible Endoscope</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Coherent bundle imaging with distal optical illumination</text>
    </svg>`
  },
  {
    name: 'fiber_sensor.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#0f172a"/>
      <!-- Structural beam representation (concrete/steel bridge segment) -->
      <rect x="40" y="160" width="520" height="80" rx="4" fill="#334155" stroke="#475569" stroke-width="2"/>
      <line x1="40" y1="200" x2="560" y2="200" stroke="#0284c7" stroke-width="6"/>
      <!-- FBG periodic grating pattern -->
      <rect x="240" y="194" width="120" height="12" fill="#0369a1"/>
      <line x1="260" y1="194" x2="260" y2="206" stroke="#ffffff" stroke-width="2"/>
      <line x1="280" y1="194" x2="280" y2="206" stroke="#ffffff" stroke-width="2"/>
      <line x1="300" y1="194" x2="300" y2="206" stroke="#ffffff" stroke-width="2"/>
      <line x1="320" y1="194" x2="320" y2="206" stroke="#ffffff" stroke-width="2"/>
      <line x1="340" y1="194" x2="340" y2="206" stroke="#ffffff" stroke-width="2"/>
      <rect x="24" y="24" width="340" height="52" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Structural Fiber Bragg Grating Sensor</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Strain and thermal monitoring in civil bridge infrastructure</text>
    </svg>`
  },
  {
    name: 'aerospace_fiber.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#1e293b"/>
      <!-- Aircraft avionics harness representation -->
      <path d="M 60 100 L 220 220 L 520 220" fill="none" stroke="#64748b" stroke-width="18" stroke-linecap="round"/>
      <path d="M 60 100 L 220 220 L 520 220" fill="none" stroke="#f59e0b" stroke-width="10" stroke-linecap="round"/>
      <circle cx="520" cy="220" r="16" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
      <rect x="420" y="260" width="140" height="60" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
      <text x="490" y="295" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#38bdf8">EMI IMMUNE</text>
      <rect x="24" y="24" width="340" height="52" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Avionics Fly-by-Light Optical Bus</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Electromagnetically shielded aerospace flight control links</text>
    </svg>`
  },
  {
    name: 'decorative_fiber.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#0f172a"/>
      <!-- Cold light fiber fan out -->
      <path d="M 300 400 C 300 250, 100 180, 80 80" fill="none" stroke="#38bdf8" stroke-width="4"/>
      <circle cx="80" cy="80" r="6" fill="#ffffff"/>
      <path d="M 300 400 C 300 240, 200 160, 180 60" fill="none" stroke="#0ea5e9" stroke-width="4"/>
      <circle cx="180" cy="60" r="6" fill="#ffffff"/>
      <path d="M 300 400 C 300 220, 300 140, 300 50" fill="none" stroke="#e0f2fe" stroke-width="5"/>
      <circle cx="300" cy="50" r="7" fill="#ffffff"/>
      <path d="M 300 400 C 300 240, 400 160, 420 60" fill="none" stroke="#0ea5e9" stroke-width="4"/>
      <circle cx="420" cy="60" r="6" fill="#ffffff"/>
      <path d="M 300 400 C 300 250, 500 180, 520 80" fill="none" stroke="#38bdf8" stroke-width="4"/>
      <circle cx="520" cy="80" r="6" fill="#ffffff"/>
      <rect x="24" y="24" width="340" height="52" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Illumination and Architectural Lighting</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Heat-free, UV-free remote illumination via high NA fibers</text>
    </svg>`
  },
  {
    name: 'industrial_fiber.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#1e293b"/>
      <!-- Industrial DIN rail patch module -->
      <rect x="120" y="80" width="360" height="240" rx="6" fill="#334155" stroke="#64748b" stroke-width="3"/>
      <rect x="150" y="120" width="80" height="40" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
      <rect x="260" y="120" width="80" height="40" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
      <rect x="370" y="120" width="80" height="40" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
      <!-- Fiber patch cords entering module -->
      <path d="M 190 320 L 190 160" stroke="#f59e0b" stroke-width="8"/>
      <path d="M 300 320 L 300 160" stroke="#0284c7" stroke-width="8"/>
      <path d="M 410 320 L 410 160" stroke="#10b981" stroke-width="8"/>
      <rect x="24" y="24" width="340" height="52" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Industrial Automation Control Panel</text>
      <text x="36" y="64" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">High noise immunity fiber buses for factory control cells</text>
    </svg>`
  }
];

// Write application visual SVGs (also accessible as .svg and .jpg for universal compatibility)
appVisuals.forEach(v => {
  const svgPath = path.join(targetDir, v.name.replace('.jpg', '.svg'));
  fs.writeFileSync(svgPath, v.svg);
  // Also write the .jpg file so that both extensions resolve without error
  fs.writeFileSync(path.join(targetDir, v.name), v.svg);
});

console.log('Successfully written labeled technical SVG diagrams and application visual assets.');
