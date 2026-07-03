const path = require('path');
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const defaultOrigins = [
  'http://localhost:5500','http://127.0.0.1:5500','http://localhost:3000','http://127.0.0.1:3000',
];

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CORS_ORIGIN]
    : defaultOrigins;


app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS.'));
  },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MS Studio backend is running.' });
});

app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  const isCorsError = error.message === 'Origin not allowed by CORS.';
  const statusCode = isCorsError ? 403 : error.status || error.statusCode || 500;
  const message = {
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
  app.listen(PORT, () => {
    console.log(`MS Studio backend running on port ${PORT}`);
  });
}

module.exports = app;
