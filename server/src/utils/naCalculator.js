/**
 * FiberLab Numerical Aperture Physics Utilities
 * Pure mathematical functions for calculating NA, acceptance angle, and statistics.
 */

/**
 * Calculates the Numerical Aperture (NA) and acceptance angle for a single reading.
 * @param {number} L - Distance between fiber end and screen in cm.
 * @param {number} D - Diameter of the circular laser spot on screen in cm.
 * @returns {Object} Calculated values including halfD, hypotenuse, NA, and theta (degrees).
 */
function calculateSingleReading(L, D) {
  const numL = Number(L);
  const numD = Number(D);

  if (isNaN(numL) || isNaN(numD) || numL <= 0 || numD <= 0) {
    throw new Error('L and D must be positive numbers');
  }

  const halfD = numD / 2;
  const hypotenuse = Math.sqrt(numL * numL + halfD * halfD);
  const rawNA = halfD / hypotenuse;
  const naClamped = Math.min(Math.max(rawNA, 0), 1);
  const thetaRad = Math.asin(naClamped);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  return {
    L: Number(numL.toFixed(3)),
    D: Number(numD.toFixed(3)),
    halfD: Number(halfD.toFixed(3)),
    hypotenuse: Number(hypotenuse.toFixed(4)),
    naRaw: rawNA,
    naFormatted: Number(rawNA.toFixed(3)),
    thetaRaw: thetaDeg,
    thetaFormatted: Number(thetaDeg.toFixed(2))
  };
}

/**
 * Calculates the statistics across an array of readings.
 * Recomputes each reading server-side to prevent tampering or client calculation drift.
 * @param {Array<{L: number, D: number}>} readings
 * @returns {Object} Processed readings, averageNA, acceptanceAngle, and acceptanceCone.
 */
function processObservationReadings(readings) {
  if (!Array.isArray(readings) || readings.length === 0) {
    throw new Error('At least one reading is required');
  }

  const processed = readings.map((r, index) => {
    const calc = calculateSingleReading(r.L, r.D);
    return {
      sNo: index + 1,
      L: calc.L,
      D: calc.D,
      halfD: calc.halfD,
      hypotenuse: calc.hypotenuse,
      NA: calc.naFormatted,
      theta: calc.thetaFormatted,
      naRaw: calc.naRaw,
      thetaRaw: calc.thetaRaw
    };
  });

  const sumNA = processed.reduce((acc, curr) => acc + curr.naRaw, 0);
  const averageNA = sumNA / processed.length;

  const clampedAvgNA = Math.min(Math.max(averageNA, 0), 1);
  const acceptanceAngleRad = Math.asin(clampedAvgNA);
  const acceptanceAngleDeg = (acceptanceAngleRad * 180) / Math.PI;
  const acceptanceConeDeg = 2 * acceptanceAngleDeg;

  return {
    readings: processed.map(({ sNo, L, D, halfD, hypotenuse, NA, theta }) => ({
      sNo,
      L,
      D,
      halfD,
      hypotenuse,
      NA,
      theta
    })),
    averageNA: Number(averageNA.toFixed(3)),
    acceptanceAngle: Number(acceptanceAngleDeg.toFixed(2)),
    acceptanceCone: Number(acceptanceConeDeg.toFixed(2))
  };
}

/**
 * Calculates percentage error given experimental NA and theoretical NA.
 * @param {number} experimentalNA
 * @param {number} theoreticalNA
 * @returns {number|null} Percentage error or null if theoretical NA is invalid.
 */
function calculatePercentageError(experimentalNA, theoreticalNA) {
  const exp = Number(experimentalNA);
  const theo = Number(theoreticalNA);
  if (isNaN(exp) || isNaN(theo) || theo <= 0) {
    return null;
  }
  const error = (Math.abs(exp - theo) / theo) * 100;
  return Number(error.toFixed(2));
}

module.exports = {
  calculateSingleReading,
  processObservationReadings,
  calculatePercentageError
};
