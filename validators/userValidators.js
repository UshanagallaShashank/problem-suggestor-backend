// backend/validators/userValidators.js

const { body } = require('express-validator');
module.exports.updateProfileValidation = [ body('username').optional().notEmpty(), body('email').optional().isEmail() ];
