// backend/validators/authValidators.js
const { body } = require('express-validator');
module.exports.registerValidation = [ body('username').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }) ];
module.exports.loginValidation = [ body('email').isEmail(), body('password').notEmpty() ];
