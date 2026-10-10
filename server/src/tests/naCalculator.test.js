const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateSingleReading,
  processObservationReadings,
  calculatePercentageError
} = require('../utils/naCalculator');

test('Verification 2: Single reading L=4 cm, D=3.2 cm gives NA=0.371', () => {
  const result = calculateSingleReading(4, 3.2);

  assert.equal(result.halfD, 1.6);
  assert.equal(result.L, 4);
  assert.equal(result.hypotenuse, 4.3081);
  assert.equal(result.naFormatted, 0.371);

  // Theoretical arcsin(0.371389) in degrees: 21.795... degrees rounds to 21.8
  assert.equal(result.thetaFormatted, 21.8);
});

test('Verification 2: 5-row example observation calculation and averages', () => {
  const exampleRows = [
    { L: 2.0, D: 1.6 },
    { L: 3.0, D: 2.4 },
    { L: 4.0, D: 3.2 },
    { L: 5.0, D: 4.0 },
    { L: 6.0, D: 4.8 }
  ];

  const processed = processObservationReadings(exampleRows);

  assert.equal(processed.readings.length, 5);
  // Each reading has constant ratio D/(2L) = 0.4 / 1 = 0.4
  // halfD = 0.8, 1.2, 1.6, 2.0, 2.4
  // NA = 0.8 / sqrt(4 + 0.64) = 0.8 / 2.15406 = 0.371389
  assert.equal(processed.averageNA, 0.371);
  assert.equal(processed.acceptanceAngle, 21.8);
  assert.equal(processed.acceptanceCone, 43.6);
});

test('Rejects invalid input (zero or negative values)', () => {
  assert.throws(() => calculateSingleReading(0, 3.2), /positive numbers/);
  assert.throws(() => calculateSingleReading(4, -1), /positive numbers/);
  assert.throws(() => calculateSingleReading('invalid', 2), /positive numbers/);
});

test('Percentage error calculation', () => {
  // If experimental NA = 0.371 and theoretical NA = 0.380
  const err = calculatePercentageError(0.371, 0.380);
  assert.equal(err, 2.37);

  // Exact match gives 0% error
  const exact = calculatePercentageError(0.371, 0.371);
  assert.equal(exact, 0);
});
