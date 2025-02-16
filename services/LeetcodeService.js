// backend/services/LeetcodeService.js
const Problem = require('../models/Problem');
module.exports.fetchQuestions = async () => { return await Problem.find(); };
module.exports.fetchQuestionById = async (id) => { return await Problem.findById(id); };
module.exports.createProblem = async (data) => { return await Problem.create(data); };
module.exports.updateProblem = async (id, data) => { return await Problem.findByIdAndUpdate(id, data, { new: true }); };
module.exports.deleteProblem = async (id) => { return await Problem.findByIdAndDelete(id); };
