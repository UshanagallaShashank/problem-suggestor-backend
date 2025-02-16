// backend/services/PointsService.js
const User = require('../models/User');
module.exports.addPoints = async (userId, points) => {
  const user = await User.findById(userId);
  user.points += points;
  await user.save();
  return user.points;
};
