const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.log(`[MongoDB Tip]: Set your MongoDB Atlas connection string in .env (MONGO_URI)`);
    console.warn(`[MongoDB Warning]: Server running in resilient mode without active database connection.`);
    console.log(`[MongoDB Tip]: Set your real MongoDB Atlas connection string in Render environment variables (MONGO_URI)`);
  }
};

module.exports = connectDB;
