// backend/graphql/resolvers/adminResolvers.js
const User = require('../../models/User');
module.exports = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id)
  },
  Mutation: {
    updateUser: async (_, { id, input }) => await User.findByIdAndUpdate(id, input, { new: true }),
    deleteUser: async (_, { id }) => { await User.findByIdAndDelete(id); return true; }
  }
};
