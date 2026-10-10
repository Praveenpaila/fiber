const mongoose = require('mongoose');

const precautionSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true },
  isLaserSafety: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Precaution', precautionSchema);
