// backend/server.js
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const dbConnect = require('./config/db');
dbConnect();
const app = require('./app');
const PORT = process.env.PORT || 5000;
http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
