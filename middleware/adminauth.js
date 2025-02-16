// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify token and decode user ID and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;

    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: error.message });
  }
};

module.exports = auth;
