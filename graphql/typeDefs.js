// backend/graphql/typeDefs.js
const { gql } = require('apollo-server-express');
module.exports = gql`
type User {
  id: ID
  username: String
  email: String
  role: String
  points: Int
}
type Problem {
  id: ID
  title: String
  description: String
  testCases: [String]
}
type Query {
  users: [User]
  user(id: ID): User
  problems: [Problem]
  problem(id: ID): Problem
  profile: User
}
input UserInput {
  username: String
  email: String
  role: String
}
input ProblemInput {
  title: String
  description: String
  testCases: [String]
}
type Mutation {
  updateUser(id: ID, input: UserInput): User
  deleteUser(id: ID): Boolean
  createProblem(input: ProblemInput): Problem
  updateProblem(id: ID, input: ProblemInput): Problem
  deleteProblem(id: ID): Boolean
  updateProfile(input: UserInput): User
}
`;
