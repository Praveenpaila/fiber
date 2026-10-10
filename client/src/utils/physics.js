/**
 * Client-side physics calculation utilities for FiberLab.
 * Implements identical formulas to the backend.
 */

export function calculateRow(L, D) {
  const numL = parseFloat(L);
  const numD = parseFloat(D);

  if (isNaN(numL) || isNaN(numD) || numL <= 0 || numD <= 0) {
    return {
      halfD: '',
      hypotenuse: '',
      NA: '',
      theta: '',
      isValid: false
    };
  }

  const halfD = numD / 2;
  const hypotenuse = Math.sqrt(numL * numL + halfD * halfD);
  const rawNA = halfD / hypotenuse;
  const naClamped = Math.min(Math.max(rawNA, 0), 1);
  const thetaRad = Math.asin(naClamped);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  return {
    halfD: Number(halfD.toFixed(3)),
    hypotenuse: Number(hypotenuse.toFixed(4)),
    NA: Number(rawNA.toFixed(3)),
    theta: Number(thetaDeg.toFixed(2)),
    rawNA,
    isValid: true
  };
}

export function computeTableAverages(rows) {
  const validRows = rows
    .map(r => calculateRow(r.L, r.D))
    .filter(r => r.isValid);

  if (validRows.length === 0) {
    return {
      averageNA: 0,
      acceptanceAngle: 0,
      acceptanceCone: 0,
      hasValidData: false
    };
  }

  const sumNA = validRows.reduce((acc, curr) => acc + curr.rawNA, 0);
  const averageNA = sumNA / validRows.length;
  const clampedAvgNA = Math.min(Math.max(averageNA, 0), 1);
  const thetaRad = Math.asin(clampedAvgNA);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  return {
    averageNA: Number(averageNA.toFixed(3)),
    acceptanceAngle: Number(thetaDeg.toFixed(2)),
    acceptanceCone: Number((2 * thetaDeg).toFixed(2)),
    hasValidData: true
  };
}

export function computePercentageError(expNA, theoNA) {
  const exp = parseFloat(expNA);
  const theo = parseFloat(theoNA);
  if (isNaN(exp) || isNaN(theo) || theo <= 0) {
    return null;
  }
  return Number(((Math.abs(exp - theo) / theo) * 100).toFixed(2));
}
