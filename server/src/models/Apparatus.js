const mongoose = require('mongoose');

const apparatusSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  specs: { type: [String], default: [] },
  dimensions: { type: String, required: true },
  hotspotLabels: { type: [String], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Apparatus', apparatusSchema);
