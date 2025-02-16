// backend/controllers/submissionController.js
const Submission = require('../models/Submission');
exports.createSubmission = async (req, res) => { const submission = await Submission.create(req.body); res.json(submission); };
exports.getSubmission = async (req, res) => { const submission = await Submission.findById(req.params.id); res.json(submission); };
exports.updateSubmission = async (req, res) => { const submission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(submission); };
exports.deleteSubmission = async (req, res) => { await Submission.findByIdAndDelete(req.params.id); res.json({ success: true }); };
