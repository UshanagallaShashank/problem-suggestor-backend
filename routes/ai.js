const express = require('express');
const router = express.Router();
const geminiProController = require('../controllers/aiController');
const  {improveUserCode} =require("../controllers/aiCodeSuggestor")
// Use the auth middleware to protect this route.
router.post('/prompt', async (req, res) => {
    const { prompt } = req.body;
    try {
      const completion = await geminiProController.processPrompt(prompt);
      if (!completion) {
        return res.status(404).json({ success: false, error: 'No completion found' });
      }
      return res.json({ success: true, completion });
    } catch (err) {
      console.error('Error fetching completion:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  });


router.post('/suggestor/:slug', async (req, res) => {
    const { slug } = req.params;
    const { userCode } = req.body;
    
    try {
      const suggestion = await improveUserCode(slug, userCode);
      if (!suggestion) {
        return res.status(404).json({ success: false, error: 'No improvement suggestion found' });
      }
      res.json({ success: true, suggestion });
    } catch (err) {
      console.error('Error fetching improvement suggestion:', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  });
module.exports = router;

