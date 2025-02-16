// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { insertAllProblems } = require('../controllers/problemController');
const authController = require('../controllers/authController');
router.post('/register', authController.register);
router.post('/login', authController.login);
// POST /problems/insert - Inserts all problems into the DB (skips duplicates)
router.post('/problems/insert', async (req, res) => {
  await insertAllProblems(req, res);
});

module.exports = router;