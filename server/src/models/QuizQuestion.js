const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
