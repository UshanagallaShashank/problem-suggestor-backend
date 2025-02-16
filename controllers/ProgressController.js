const mongoose = require('mongoose');
const UserProgress = require('../models/UserProgress');
const Problem = require('../models/Problem');

async function insertUserProgress(req, res) {
  try {
    // Expect only "slug" and an optional improvementSuggestion in the request body.
    const { slug, improvementSuggestion } = req.body;
    
    // Validate required field.
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: slug'
      });
    }
    
    // Get the authenticated user's ID from req.user (set by auth middleware).
    const userId = req.user._id;
    
    // Look up the Problem document by its slug.
    const problemDoc = await Problem.findOne({ titleSlug: slug });
    if (!problemDoc) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found with the provided slug.'
      });
    }
    
    // Extract required fields from the problem document.
    const { _id: problemId, difficulty, acRate, questionFrontendId } = problemDoc;
    
    // Map the problem difficulty to the corresponding level.
    // For example: "Easy" => "Beginner", "Medium" => "Intermediate", "Hard" => "Advanced".
    const levelMapping = {
      "Easy": "Beginner",
      "Medium": "Intermediate",
      "Hard": "Advanced"
    };
    const mappedLevel = levelMapping[difficulty];
    if (!mappedLevel) {
      return res.status(400).json({
        success: false,
        error: 'Invalid problem difficulty.'
      });
    }
    
    // Create a new UserProgress record, including questionFrontendId and slug.
    const progress = new UserProgress({
      userId,
      problemId,
      slug, // Store the problem slug.
      difficulty,
      acRate,
      level: mappedLevel,
      improvementSuggestion: improvementSuggestion || '',
      questionFrontendId
    });
    
    // Save the new record to the database.
    const savedProgress = await progress.save();
    return res.status(201).json({ success: true, progress: savedProgress });
  } catch (err) {
    console.error('Error inserting user progress:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { insertUserProgress };
