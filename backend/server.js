import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { connectDB } from './services/mongodb.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import logger from './services/logger.js';

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
await connectDB();

// CORS configuration to allow credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Dynamically import passport AFTER environment variables are loaded
const { default: passport } = await import('./services/passport.js');

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  logger.startup('BEDA Server', PORT);
}); 