const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const snippetRoutes = require('./routes/snippetRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Global middleware
// CORS configuration: allow specific origin(s) via env `CORS_ORIGIN`, defaults to permissive
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser clients or same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true); // allow all if not configured
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight across the board
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/snippets', snippetRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Simple root message for platform checks (Render/Heroku root URL)
app.get('/', (req, res) => {
  res.type('text/plain').send('CodeStash API is running. Check /api/health or use the frontend app.');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
