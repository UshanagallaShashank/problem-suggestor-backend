const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    // 🛠 Role Management (Dropdown)
    role: { 
      type: String, 
      enum: ['user', 'admin', 'moderator'], 
      default: 'user' 
    },

    // 📸 Profile Information
    profilePicture: { type: String, default: 'default-avatar.png' }, // File Upload Support
    bio: { type: String, maxlength: 250 }, // Increased Length
    phoneNumber: { type: String, default: null },

    // 📍 Address (Dropdown for Country, State, City)
    address: {
      country: { type: String, default: null },
      state: { type: String, default: null },
      city: { type: String, default: null },
      zipCode: { type: String, default: null },
    },

    // 🎓 Skills & Education
    skills: [{ type: String, default: [] }], 
    codingLanguages: [{ 
      type: String, 
      enum: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift', 'TypeScript'],
      default: [] 
    }], // Coding languages (Dropdown Selection)

    education: {
      degree: { type: String, default: null },
      institution: { type: String, default: null },
      yearOfCompletion: { type: Number, default: null },
    },

    // 🏆 Achievements & Certifications
    achievements: [{ type: String, default: [] }], 
    certifications: [{ type: String, default: [] }], 

    // 🏅 Coding Profiles (LeetCode, GitHub, etc.)
    codingProfiles: {
      leetcode: { type: String, default: null },
      codeforces: { type: String, default: null },
      codechef: { type: String, default: null },
      hackerrank: { type: String, default: null },
    },

    // ⚙️ User Preferences (Dropdowns)
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      language: { type: String, enum: ['English', 'Spanish', 'French', 'German', 'Hindi'], default: 'English' },
      notificationFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    },

    // 🔗 Social Media Links
    socialLinks: {
      github: { type: String, default: null },
      linkedin: { type: String, default: null },
      twitter: { type: String, default: null },
      website: { type: String, default: null },
    },

    // 🔔 Notifications & Activity
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
    loginHistory: [{ 
      date: { type: Date, default: Date.now }, 
      ip: { type: String, default: null } 
    }], // Track login history

    // 🔐 Security Settings
    isActive: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    lastLogin: { type: Date, default: null },

    // 🏅 Gamification & Points System
    points: { type: Number, default: 0 },
    badges: [{ type: String, default: [] }],

    // 🔄 Tracking Updates
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
