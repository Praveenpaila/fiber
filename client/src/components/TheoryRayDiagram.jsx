import React, { useState } from 'react';

export function TheoryRayDiagram() {
  const [incidentAngle, setIncidentAngle] = useState(15); // degrees
  const n1 = 1.50; // Core refractive index
  const n2 = 1.45; // Cladding refractive index
  const n0 = 1.00; // Air

  // Theoretical calculations
  const theoreticalNA = Math.sqrt(n1 * n1 - n2 * n2); // ~0.384
  const acceptanceAngleDeg = (Math.asin(theoreticalNA / n0) * 180) / Math.PI; // ~22.58 deg
  const criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI; // ~75.16 deg

  // Snell law at entrance face: sin(theta_r) = sin(theta_in) / n1
  const thetaInRad = (incidentAngle * Math.PI) / 180;
  const sinThetaR = Math.sin(thetaInRad) / n1;
  const thetaRRad = Math.asin(sinThetaR);
  const thetaRDeg = (thetaRRad * 180) / Math.PI;

  // Angle at core-cladding interface: phi = 90 - theta_r
  const phiDeg = 90 - thetaRDeg;
  const isGuided = incidentAngle <= acceptanceAngleDeg;

  // Diagram geometry coordinates
  // Entrance face at x = 160
  // Fiber core extends from x = 160 to x = 580, y = 140 to y = 260 (center y = 200, half-height = 60)
  const entranceX = 180;
  const centerY = 200;
  const coreHalfH = 55;

  // Incident ray starts at left: length = 120
  const rayLen = 130;
  const startX = entranceX - rayLen * Math.cos(thetaInRad);
  const startY = centerY - rayLen * Math.sin(thetaInRad);

  // Refracted ray inside core: hits top boundary (y = centerY - coreHalfH = 145)
  // deltaY = -coreHalfH = -55
  // tan(theta_r) = deltaY / deltaX => deltaX = coreHalfH / tan(theta_r)
  const tanR = Math.tan(thetaRRad);
  const hit1X = tanR > 0.001 ? Math.min(entranceX + coreHalfH / tanR, 520) : 520;
  const hit1Y = tanR > 0.001 ? centerY - coreHalfH : centerY;

  // Next bounce if guided: reflects down to bottom boundary (y = centerY + coreHalfH = 255)
  const hit2X = hit1X + (coreHalfH * 2) / (tanR > 0.001 ? tanR : 1);
  const hit2Y = centerY + coreHalfH;

  // Refracted ray into cladding if not guided:
  // Snell at cladding: n1 * sin(phi) = n2 * sin(theta_cladding)
  const phiRad = (phiDeg * Math.PI) / 180;
  const sinClad = (n1 * Math.sin(phiRad)) / n2;
  const cladAngleRad = sinClad <= 1 ? Math.asin(sinClad) : 0;
  // Lost ray direction in cladding
  const lostEndX = hit1X + 80;
  const lostEndY = hit1Y - 45;

  return (
    <div className="lab-card p-5 bg-surface border border-borderline">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-borderline gap-3">
        <div>
          <h4 className="font-semibold text-charcoal-900 text-sm">
            Interactive Ray Trajectory and Acceptance Cone
          </h4>
          <p className="text-xs text-charcoal-600">
            Adjust the incident angle &theta;<sub>in</sub> to observe total internal reflection inside the core.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded font-semibold border ${
              isGuided
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-laser-light text-laser border-red-300'
            }`}
          >
            {isGuided
              ? 'Guided by Total Internal Reflection'
              : 'Lost to Cladding (Attenuation)'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full mt-4 bg-slate-50 border border-borderline rounded overflow-hidden">
        <svg
          viewBox="0 0 640 360"
          className="w-full h-auto block select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Air medium background on left */}
          <rect x="0" y="0" width={entranceX} height="360" fill="#f8fafc" />
          <text x="70" y="35" font-family="Inter, sans-serif" font-size="12" fill="#64748b" font-weight="600">
            Air (n0 = 1.00)
          </text>

          {/* Upper Cladding */}
          <rect x={entranceX} y="30" width="460" height="115" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
          <text x={entranceX + 20} y="60" font-family="Inter, sans-serif" font-size="12" fill="#475569" font-weight="600">
            Cladding (n2 = 1.45)
          </text>

          {/* Core */}
          <rect x={entranceX} y="145" width="460" height="110" fill="#f1f5f9" stroke="#0284c7" stroke-width="1.5" />
          <text x={entranceX + 20} y="175" font-family="Inter, sans-serif" font-size="12" fill="#0369a1" font-weight="600">
            Core (n1 = 1.50)
          </text>

          {/* Lower Cladding */}
          <rect x={entranceX} y="255" width="460" height="85" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
          <text x={entranceX + 20} y="290" font-family="Inter, sans-serif" font-size="12" fill="#475569" font-weight="600">
            Cladding (n2 = 1.45)
          </text>

          {/* Optical axis */}
          <line
            x1="20"
            y1={centerY}
            x2="620"
            y2={centerY}
            stroke="#94a3b8"
            stroke-width="1.5"
            stroke-dasharray="6 4"
          />

          {/* Fiber entrance face line */}
          <line
            x1={entranceX}
            y1="30"
            x2={entranceX}
            y2="340"
            stroke="#0f172a"
            stroke-width="2"
          />

          {/* Acceptance cone visualization in air */}
          <polygon
            points={`${entranceX},${centerY} 20,${centerY - 130 * Math.tan((acceptanceAngleDeg * Math.PI) / 180)} 20,${centerY + 130 * Math.tan((acceptanceAngleDeg * Math.PI) / 180)}`}
            fill="#0369a1"
            fill-opacity="0.08"
            stroke="#0369a1"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <text x="35" y={centerY + 65} font-family="Inter, sans-serif" font-size="10" fill="#0369a1" font-weight="500">
            Acceptance Cone (&theta;0 = {acceptanceAngleDeg.toFixed(1)}&deg;)
          </text>

          {/* Incident Light Ray */}
          <line
            x1={startX}
            y1={startY}
            x2={entranceX}
            y2={centerY}
            stroke={isGuided ? '#dc2626' : '#b91c1c'}
            stroke-width="2.5"
          />

          {/* Ray arrow at entrance */}
          <circle cx={entranceX} cy={centerY} r="3" fill="#dc2626" />

          {/* Ray inside core: from entrance to first interface hit */}
          <line
            x1={entranceX}
            y1={centerY}
            x2={hit1X}
            y2={hit1Y}
            stroke={isGuided ? '#dc2626' : '#94a3b8'}
            stroke-width="2.5"
          />

          {/* Interface normal at hit1 */}
          <line
            x1={hit1X}
            y1={hit1Y - 30}
            x2={hit1X}
            y2={hit1Y + 30}
            stroke="#64748b"
            stroke-width="1"
            stroke-dasharray="3 3"
          />

          {isGuided ? (
            /* Total internal reflection path */
            <>
              <line
                x1={hit1X}
                y1={hit1Y}
                x2={Math.min(hit2X, 600)}
                y2={hit2X <= 600 ? hit2Y : centerY + (hit1Y === 145 ? (600 - hit1X) * Math.tan(thetaRRad) : 0)}
                stroke="#dc2626"
                stroke-width="2.5"
              />
              {hit2X < 600 && (
                <line
                  x1={hit2X}
                  y1={hit2Y}
                  x2="620"
                  y2={hit2Y - (620 - hit2X) * Math.tan(thetaRRad)}
                  stroke="#dc2626"
                  stroke-width="2.5"
                />
              )}
            </>
          ) : (
            /* Refracted ray lost into cladding */
            <>
              <line
                x1={hit1X}
                y1={hit1Y}
                x2={lostEndX}
                y2={lostEndY}
                stroke="#dc2626"
                stroke-width="2"
                stroke-dasharray="4 3"
              />
              <text
                x={lostEndX + 8}
                y={lostEndY + 4}
                font-family="Inter, sans-serif"
                font-size="11"
                fill="#dc2626"
                font-weight="600"
              >
                Refracted out (Lost)
              </text>
            </>
          )}

          {/* Incident Angle arc label */}
          <text
            x={entranceX - 55}
            y={centerY - 10}
            font-family="JetBrains Mono, monospace"
            font-size="11"
            fill="#0f172a"
            font-weight="600"
          >
            &theta;in = {incidentAngle}&deg;
          </text>
        </svg>
      </div>

      {/* Control slider */}
      <div className="mt-4 pt-3 border-t border-borderline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label htmlFor="ray-slider" className="text-xs font-semibold text-charcoal-700">
            Incident Angle &theta;<sub>in</sub>: <span className="font-mono text-primary text-sm">{incidentAngle}&deg;</span>
          </label>
          <div className="text-xs text-charcoal-600 font-mono">
            Acceptance limit &theta;<sub>0</sub>: {acceptanceAngleDeg.toFixed(2)}&deg; | Core interface &phi;: {phiDeg.toFixed(1)}&deg; (Critical: {criticalAngleDeg.toFixed(1)}&deg;)
          </div>
        </div>

        <input
          id="ray-slider"
          type="range"
          min="0"
          max="40"
          step="0.5"
          value={incidentAngle}
          onChange={e => setIncidentAngle(parseFloat(e.target.value))}
          className="w-full accent-primary h-2 bg-slate-200 rounded cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-charcoal-500 font-mono mt-1">
          <span>0&deg; (Axial)</span>
          <span className="text-primary font-semibold">&theta;0 = {acceptanceAngleDeg.toFixed(1)}&deg; (Cutoff)</span>
          <span>40&deg;</span>
        </div>
      </div>
    </div>
  );
}
