const path = require('path');
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config({
  path: path.join(__dirname, '.env'),
  quiet: true,
});

const app = express();

const defaultOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const productionOrigins = [
  'https://legendary-biscotti-961e0e.netlify.app',
];

function normalizeOrigin(origin) {
  return String(origin || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\/+$/, '');
}

function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
}

const allowedOrigins = [
  ...defaultOrigins,
  ...productionOrigins,
  ...parseOrigins(process.env.CORS_ORIGIN),
]
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS.'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204,
};

app.disable('x-powered-by');

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MS Studio backend is running.',
  });
});

app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use((error, req, res, next) => {
  const isCorsError =
    error &&
    (error.message === 'Origin not allowed by CORS.' ||
      error.name === 'CorsError');

  const statusCode = isCorsError
    ? 403
    : error.statusCode || error.status || 500;

  const message =
    {
      400: 'Invalid request payload.',
      403: 'This website origin is not allowed.',
      413: 'Request body is too large.',
    }[statusCode] || 'Internal server error.';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 5000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MS Studio backend running on port ${PORT}`);
  });
}

module.exports = app;