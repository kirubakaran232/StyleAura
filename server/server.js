require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const multer = require('multer');
const connectDB = require('./config/db');

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://styleaura-1.onrender.com",
  "https://styleaura-app.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/newsletter', require('./routes/newsletter'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  // Multer upload errors should be client errors, not 500.
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large. Max allowed size is 20MB per file.'
        : err.message,
    });
  }

  // Common DB/input issues should also be explicit.
  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A blog with the same unique field already exists.',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
