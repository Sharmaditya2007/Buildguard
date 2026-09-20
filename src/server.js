require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]:', err);
  process.exit(1);
});

// Connect to MongoDB Atlas and start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  BuildGuard AI Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🚀  Listening on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION]:', err);
    server.close(() => process.exit(1));
  });
};

startServer();
