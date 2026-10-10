const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  whyNaMatters: { type: String, required: true },
  imagePath: { type: String, required: true },
  sourceInfo: {
    author: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    license: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
