import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './services/mongodb.js';
import apiRoutes from './routes/api.js';
import logger from './services/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
await connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  logger.startup('BEDA Server', PORT);
}); 