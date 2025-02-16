const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recordType' // Dynamically reference the model specified in recordType
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  questionFrontendId: {
    type: String,
    required: true
  },
  slug: { 
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  acRate: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  improvementSuggestion: String,
  solvedAt: {
    type: Date,
    default: Date.now
  },
  // recordType specifies which model the userId references (either "User" or "Admin").
  recordType: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure a unique combination of user and problem.
userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);

