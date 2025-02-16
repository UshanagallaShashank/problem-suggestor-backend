// backend/routes/submissions.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { insertUserProgress } = require('../controllers/ProgressController');
const auth = require('../middleware/auth');
router.post('/', submissionController.createSubmission);
router.get('/:id', submissionController.getSubmission);
router.put('/:id', submissionController.updateSubmission);
router.delete('/:id', submissionController.deleteSubmission);


// PUT /progress - Update or create a user progress record.
// Expected request body fields:
//   - userId (string): The user's ID
//   - problemId (string): The problem's identifier (or slug)
//   - difficulty (string): 'Easy', 'Medium', or 'Hard'
//   - acRate (number): Acceptance rate when solved
//   - level (string): The level at which the problem was solved (e.g. 'Easy')
//   - improvementSuggestion (string, optional): Any improvement feedback
router.post('/progress', auth, async (req, res) => {
  // Overwrite or set userId based on the authenticated user.
  req.body.userId = req.user._id;
  await insertUserProgress(req, res);
});
module.exports = router;
