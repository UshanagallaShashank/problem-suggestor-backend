const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('../config/jwt');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body; // Optionally accept 'role'

  // Default role is 'user', but if 'admin' is passed in the request, set role to 'admin'
  const userRole = role === 'admin' ? 'admin' : 'user';

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password
  const hash = await bcrypt.hash(password, 10);

  // Create and save the user
  const user = new User({
    username,
    email,
    password: hash,
    role: userRole, // Use the calculated role (either 'user' or 'admin')
  });
  await user.save();

  res.status(201).json({ message: 'User registered successfully', user });
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate the JWT token using the sign method from jwt.js
  const token = jwt.sign({ id: user._id, role: user.role });

  // Respond with the token
  res.json({ token ,role:user.role});
};