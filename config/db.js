const mongoose = require('mongoose');

async function dbConnect() {
  try {
    // Connect to the database using the connection string from your environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure if the connection fails.
  }
}

module.exports = dbConnect;
