const express = require('express');
const router = express.Router();
const { insertAllProblems } = require('../controllers/problemController');

// POST /problems/insert - Inserts all problems into the DB (skips duplicates)
router.post('/problems/insert', async (req, res) => {
  await insertAllProblems(req, res);
});

module.exports = router;