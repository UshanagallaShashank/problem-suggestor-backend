const express = require('express');
const router = express.Router();

// Import controller functions
const { fetchAllQuestions, fetchQuestionContent } = require('../controllers/leetcodeController');
const { fetchCommunitySolutions, improveUserCode } = require('../controllers/leetcodeSolutionController');

// Route 1: GET /leetcode/questions
// Returns a list of questions (supports pagination with query parameters: limit and skip)
router.get('/questions', async (req, res) => {
  const limit = Number(req.query.limit)|| 6000;
  const skip = Number(req.query.skip) || 0;
  try {
    const questions = await fetchAllQuestions(limit, skip);
    res.json({ success: true, questions });
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route 2: GET /leetcode/question/:slug
// Returns detailed content for a single question identified by its slug
router.get('/question/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const question = await fetchQuestionContent(slug);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (err) {
    console.error('Error fetching question content:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route 3: GET /leetcode/solution/:slug
// Returns the official solution for a question identified by its slug
router.get('/solution/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const solution = await fetchCommunitySolutions(slug);
    if (!solution) {
      return res.status(404).json({ success: false, error: 'Solution not found' });
    }
    res.json({ success: true, solution });
  } catch (err) {
    console.error('Error fetching official solution:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});



router.post('/suggestor/:slug', async (req, res) => {
  const { slug } = req.params;
const { userCode } = req.body;          // Code provided by the user
  try {
    const solution = await improveUserCode(slug,userCode);
    if (!solution) {
      return res.status(404).json({ success: false, error: ' not improvement' });
    }
    res.json({ success: true, solution });
  } catch (err) {
    console.error('Error fetching official solution:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
