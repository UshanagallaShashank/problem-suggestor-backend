// backend/graphql/resolvers/userResolvers.js
const User = require('../../models/User');
module.exports = {
  Query: {
    profile: async (_, __, { user }) => await User.findById(user._id)
  },
  Mutation: {
    updateProfile: async (_, { input }, { user }) => await User.findByIdAndUpdate(user._id, input, { new: true })
  }
};
