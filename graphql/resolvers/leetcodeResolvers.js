// backend/graphql/resolvers/leetcodeResolvers.js
const Problem = require('../../models/Problem');
module.exports = {
  Query: {
    problems: async () => await Problem.find(),
    problem: async (_, { id }) => await Problem.findById(id)
  },
  Mutation: {
    createProblem: async (_, { input }) => await Problem.create(input),
    updateProblem: async (_, { id, input }) => await Problem.findByIdAndUpdate(id, input, { new: true }),
    deleteProblem: async (_, { id }) => { await Problem.findByIdAndDelete(id); return true; }
  }
};
