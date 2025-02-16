// backend/app.js
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const adminResolvers = require('./graphql/resolvers/adminResolvers');
const leetcodeResolvers = require('./graphql/resolvers/leetcodeResolvers');
const userResolvers = require('./graphql/resolvers/userResolvers');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const leetcodeRoutes = require('./routes/leetcode');
const submissionRoutes = require('./routes/submissions');
const userRoutes = require('./routes/users');
const aiRoutes=require("./routes/ai")
const dailysuggestion=require("./routes/DailySuggestorRoute")
const Admin_auth=require("./middleware/adminauth")
const probleminsert=require("./routes/problem")
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/admin',Admin_auth, adminRoutes);
app.use('/api/leetcode', auth, leetcodeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/ai', auth,aiRoutes);
app.use('/api/daily',auth,dailysuggestion)
app.use('/api/problems',probleminsert);
const server = new ApolloServer({ typeDefs, resolvers: [adminResolvers, leetcodeResolvers, userResolvers], context: ({ req }) => ({ user: req.user }) });
server.start().then(() => { server.applyMiddleware({ app }); });
module.exports = app;
