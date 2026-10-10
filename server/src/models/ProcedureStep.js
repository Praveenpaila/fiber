const mongoose = require('mongoose');

const procedureStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ProcedureStep', procedureStepSchema);
