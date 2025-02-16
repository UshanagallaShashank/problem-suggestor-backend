const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  commentCount: { type: Number },
  viewCount: { type: Number },
  pinned: { type: Boolean },
  isFavorite: { type: Boolean },
  solutionTags: [{
    name: { type: String },
    slug: { type: String }
  }],
  post: {
    id: { type: String },
    status: { type: String },
    voteCount: { type: Number },
    creationDate: { type: Date },
    isHidden: { type: Boolean },
    author: {
      username: { type: String },
      isActive: { type: Boolean },
      nameColor: { type: String },
      activeBadge: {
        displayName: { type: String },
        icon: { type: String }
      },
      profile: {
        userAvatar: { type: String },
        reputation: { type: Number }
      }
    },
    content: { type: String }
  },
  searchMeta: {
    content: { type: String },
    contentType: { type: String },
    commentAuthor: {
      username: { type: String }
    },
    replyAuthor: {
      username: { type: String }
    },
    highlights: [{ type: String }]
  }
}, { _id: false });

const ProblemSchema = new mongoose.Schema({
  questionFrontendId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleSlug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  acRate: { type: Number, min: 0, max: 100, required: true },
  topicTags: [{
    name: { type: String, required: true }
  }],
  testCases: [String],
  solutions: [SolutionSchema] // New field to store up to 3 solutions.
}, { timestamps: true });

module.exports = mongoose.model('ProblemSchema', ProblemSchema);
