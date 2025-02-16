const express = require('express');
const router = express.Router();
const { getPersonalizedSuggestionAdvanced } = require('../controllers/DailySuggestor');

// GET /suggestion - Returns a personalized problem suggestion.
router.get('/suggestion', async (req, res) => {
  try {
    const userId = req.user._id;
    const suggestionData = await getPersonalizedSuggestionAdvanced(userId);
    res.json({ success: true, suggestionData });
  } catch (error) {
    console.error('Error generating personalized suggestion:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
