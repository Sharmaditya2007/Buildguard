require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const path = require('path');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security HTTP headers with permissive font/style policies for dashboard
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// HTTP request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint: content negotiation (JSON for API clients, HTML website for browsers)
app.get('/', (req, res, next) => {
  if (req.accepts(['html', 'json']) === 'json' || req.headers['content-type'] === 'application/json') {
    return res.status(200).json({
      platform: 'BuildGuard AI',
      version: '1.0.0',
      description: 'AI-Powered Construction Transparency Platform Backend',
      docs: '/api/v1/health',
      endpoints: {
        auth: '/api/v1/auth',
        contractor: '/api/v1/contractor',
        homeowner: '/api/v1/homeowner',
        projects: '/api/v1/projects'
      }
    });
  }
  next();
});

const fs = require('fs');

// API v1 Routing
app.use('/api/v1', apiRouter);

// Serve compiled React frontend if present; otherwise fallback to public folder
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../public')));
}

// 404 Catch-all handler for unmatched API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
