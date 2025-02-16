// backend/models/Submission.js
const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: String,
  status: String,
  points: Number
});
module.exports = mongoose.model('Submission', SubmissionSchema);
