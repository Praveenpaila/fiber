require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  CLIENT_ORIGIN
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps or curl) or if origin is in whitelist
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV !== 'production') {
      return callback(null, true);
    }
    callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: NODE_ENV
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Database Connection & Server Initialization
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fiberlab';

let server;

async function startServer() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Successfully connected to MongoDB.');

    server = app.listen(PORT, () => {
      console.log(`FiberLab API server listening on port ${PORT} in ${NODE_ENV} mode.`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Starting server in offline database mode...');
    server = app.listen(PORT, () => {
      console.log(`FiberLab API server listening on port ${PORT} (Database offline).`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server and database connection...');
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('Server process terminated.');
        process.exit(0);
      });
    });
  }
});

module.exports = { app, startServer };
