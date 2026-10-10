const express = require('express');
const { body, query, param, validationResult } = require('express-validator');

const Apparatus = require('../models/Apparatus');
const ProcedureStep = require('../models/ProcedureStep');
const Precaution = require('../models/Precaution');
const Application = require('../models/Application');
const QuizQuestion = require('../models/QuizQuestion');
const Observation = require('../models/Observation');
const { processObservationReadings, calculateSingleReading } = require('../utils/naCalculator');

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// GET /api/apparatus
router.get('/apparatus', async (req, res, next) => {
  try {
    const items = await Apparatus.find().sort({ order: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

// GET /api/procedure
router.get('/procedure', async (req, res, next) => {
  try {
    const steps = await ProcedureStep.find().sort({ stepNumber: 1 });
    res.json({ success: true, count: steps.length, data: steps });
  } catch (err) {
    next(err);
  }
});

// GET /api/precautions
router.get('/precautions', async (req, res, next) => {
  try {
    const precautions = await Precaution.find().sort({ order: 1 });
    res.json({ success: true, count: precautions.length, data: precautions });
  } catch (err) {
    next(err);
  }
});

// GET /api/applications
router.get('/applications', async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ order: 1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    next(err);
  }
});

// GET /api/quiz
router.get('/quiz', async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find().sort({ order: 1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    next(err);
  }
});

// POST /api/calculate
// Utility endpoint to calculate a single reading or batch without saving
router.post('/calculate', [
  body('readings').isArray({ min: 1 }).withMessage('Readings array with at least one row is required'),
  body('readings.*.L').isFloat({ gt: 0 }).withMessage('Distance L must be a positive number'),
  body('readings.*.D').isFloat({ gt: 0 }).withMessage('Spot diameter D must be a positive number')
], handleValidationErrors, (req, res, next) => {
  try {
    const processed = processObservationReadings(req.body.readings);
    res.json({ success: true, data: processed });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/observations?rollNo=
router.get('/observations', [
  query('rollNo').optional().trim().isString()
], handleValidationErrors, async (req, res, next) => {
  try {
    const { rollNo } = req.query;
    const filter = {};
    if (rollNo && rollNo.trim().length > 0) {
      filter.rollNo = { $regex: new RegExp(`^${rollNo.trim()}$`, 'i') };
    }
    const observations = await Observation.find(filter)
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({ success: true, count: observations.length, data: observations });
  } catch (err) {
    next(err);
  }
});

// POST /api/observations
// Recompute NA and angles server-side to guarantee integrity and reject invalid entries
router.post('/observations', [
  body('studentName').trim().notEmpty().withMessage('Student name is required').isLength({ max: 100 }).withMessage('Student name must be 100 characters or fewer'),
  body('rollNo').trim().notEmpty().withMessage('Roll number is required').isLength({ max: 50 }).withMessage('Roll number must be 50 characters or fewer'),
  body('readings').isArray({ min: 1 }).withMessage('At least one reading is required'),
  body('readings.*.L').isFloat({ gt: 0 }).withMessage('Distance L must be a positive number'),
  body('readings.*.D').isFloat({ gt: 0 }).withMessage('Spot diameter D must be a positive number')
], handleValidationErrors, async (req, res, next) => {
  try {
    const { studentName, rollNo, readings } = req.body;

    // Server-side recalculation of NA, theta, average NA, and acceptance cone
    const processed = processObservationReadings(readings);

    const newObservation = new Observation({
      studentName,
      rollNo,
      readings: processed.readings,
      averageNA: processed.averageNA,
      acceptanceAngle: processed.acceptanceAngle,
      acceptanceCone: processed.acceptanceCone
    });

    const saved = await newObservation.save();
    res.status(201).json({
      success: true,
      message: 'Observation saved successfully',
      data: saved
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/observations/:id
router.delete('/observations/:id', [
  param('id').isMongoId().withMessage('Invalid observation ID')
], handleValidationErrors, async (req, res, next) => {
  try {
    const deleted = await Observation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Observation not found' });
    }
    res.json({
      success: true,
      message: 'Observation deleted successfully',
      data: { id: req.params.id }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/observations/purge-by-roll/:rollNo
// Documented privacy route to remove all student records associated with a roll number
router.delete('/observations/purge-by-roll/:rollNo', [
  param('rollNo').trim().notEmpty().withMessage('Roll number is required')
], handleValidationErrors, async (req, res, next) => {
  try {
    const rollNo = req.params.rollNo.trim();
    const result = await Observation.deleteMany({
      rollNo: { $regex: new RegExp(`^${rollNo}$`, 'i') }
    });
    res.json({
      success: true,
      message: `Purged ${result.deletedCount} observation records for roll number ${rollNo}`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
