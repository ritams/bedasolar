import express from 'express';
import multer from 'multer';
import { convertPdfToImage } from '../services/pdfProcessor.js';
import { parseImageWithLLM } from '../services/openRouter.js';
import { saveFormData } from '../services/mongodb.js';
import logger from '../services/logger.js';
import { asyncHandler, handleError } from '../utils/errorHandler.js';

const router = express.Router();
const upload = multer({ dest: 'backend/temp/' });

router.post('/upload', upload.single('pdf'), asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  logger.upload(req.file.originalname, 'started', { fileSize: req.file.size });
  
  logger.ai('PDF conversion', 'started');
  const imageBuffer = await convertPdfToImage(req.file.path);
  logger.ai('PDF conversion', 'completed');
  
  logger.ai('LLM parsing', 'started');
  const parsedData = await parseImageWithLLM(imageBuffer);
  logger.ai('LLM parsing', 'completed', { extractedFields: Object.keys(parsedData).length });
  
  logger.upload(req.file.originalname, 'completed', { processingTime: Date.now() - startTime });
  res.json(parsedData);
}));

router.post('/submit', asyncHandler(async (req, res) => {
  logger.info('Form submission started', { fields: Object.keys(req.body) });
  const result = await saveFormData(req.body, req.body.originalFilename);
  logger.info('Form submission completed', { recordId: result._id });
  res.json({ status: 'success', _id: result._id });
}));

// Error handling middleware
router.use((error, req, res, next) => {
  const context = req.route?.path || 'Unknown route';
  handleError(res, error, context);
});

export default router; 