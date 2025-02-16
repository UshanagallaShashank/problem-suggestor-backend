const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Multer Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage }).single('profilePicture');

// ✅ Get User Profile
exports.getProfile = async (req, res) => {
  try {
    console.log(`🔍 Fetching profile for user ID: ${req.user._id}`);

    const user = await User.findById(req.user._id).select('-password -resetToken -resetTokenExpires');
    if (!user) {
      console.error('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Profile fetched successfully');
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// ✅ Update User Profile (Including Profile Picture)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`✏️ Updating profile for user ID: ${userId}`);
    let updates = { ...req.body, updatedBy: userId };

    // Handle Profile Picture Upload
    if (req.file) {
      console.log('📤 Uploading new profile picture to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'profile_pictures' });
      updates.profilePicture = result.secure_url;
      console.log(`✅ Profile picture uploaded: ${result.secure_url}`);
    }

    // Update User
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -resetToken');
    if (!updatedUser) {
      console.error('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Profile updated successfully');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('❌ Error updating profile:', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ✅ Get Daily Question (Dynamic)
exports.getDailyQuestion = async (req, res) => {
  try {
    console.log('📅 Generating daily question...');

    const dailyQuestion = {
      id: 'daily_' + new Date().toISOString().split('T')[0],
      title: 'Daily Algorithm Challenge',
      description: 'Solve today’s coding challenge to earn points!',
      difficulty: 'Medium',
      tags: ['Algorithms', 'Data Structures'],
      timeLimit: '30 min',
    };

    console.log('✅ Daily question generated:', dailyQuestion.title);
    res.json(dailyQuestion);
  } catch (error) {
    console.error('❌ Error fetching daily question:', error.message);
    res.status(500).json({ error: 'Failed to fetch daily question' });
  }
};

// ✅ Middleware for Profile Picture Upload
exports.uploadProfile = upload;
