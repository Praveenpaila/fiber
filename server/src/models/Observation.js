const mongoose = require('mongoose');

const readingItemSchema = new mongoose.Schema({
  sNo: { type: Number, required: true },
  L: { type: Number, required: true },
  D: { type: Number, required: true },
  halfD: { type: Number, required: true },
  hypotenuse: { type: Number, required: true },
  NA: { type: Number, required: true },
  theta: { type: Number, required: true }
}, { _id: false });

const observationSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true, maxlength: 100 },
  rollNo: { type: String, required: true, trim: true, maxlength: 50 },
  readings: { type: [readingItemSchema], required: true },
  averageNA: { type: Number, required: true },
  acceptanceAngle: { type: Number, required: true },
  acceptanceCone: { type: Number, required: true }
}, { timestamps: true });

observationSchema.index({ rollNo: 1 });

module.exports = mongoose.model('Observation', observationSchema);
