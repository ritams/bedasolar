import express from 'express';
import multer from 'multer';
import { convertPdfToImages } from '../services/pdfProcessor.js';
import { parseImagesWithLLM } from '../services/openRouter.js';
import { saveFormData, saveUserInfo } from '../services/mongodb.js';
import logger from '../services/logger.js';
import { asyncHandler, handleError } from '../utils/errorHandler.js';
import { requireAuth, attachUser } from '../utils/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'backend/temp/' });

// Apply authentication middleware to all API routes
router.use(requireAuth);
router.use(attachUser);

router.post('/upload', upload.single('pdf'), asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  logger.upload(req.file.originalname, 'started', { fileSize: req.file.size, userId: req.userId });
  
  logger.ai('PDF conversion', 'started');
  const imageBuffers = await convertPdfToImages(req.file.path);
  logger.ai('PDF conversion', 'completed', { pageCount: imageBuffers.length });
  
  logger.ai('LLM parsing', 'started');
  const parsedData = await parseImagesWithLLM(imageBuffers);
  logger.ai('LLM parsing', 'completed', { extractedFields: Object.keys(parsedData).length });
  
  logger.upload(req.file.originalname, 'completed', { processingTime: Date.now() - startTime, userId: req.userId });
  res.json(parsedData);
}));

router.post('/submit', asyncHandler(async (req, res) => {
  logger.info('Form submission started', { fields: Object.keys(req.body), userId: req.userId });
  const result = await saveFormData({ ...req.body, userId: req.userId }, req.body.originalFilename);
  logger.info('Form submission completed', { recordId: result._id, userId: req.userId });
  res.json({ status: 'success', _id: result._id });
}));

router.post('/userinfo', asyncHandler(async (req, res) => {
  logger.info('User info submission started', { userType: req.body.userType, userId: req.userId });
  const result = await saveUserInfo({ ...req.body, userId: req.userId });
  logger.info('User info submission completed', { recordId: result._id, roofArea: result.roofArea, userId: req.userId });
  res.json({ status: 'success', data: result });
}));

router.post('/send-email', asyncHandler(async (req, res) => {
  logger.info('Email send request', { to: req.body.email, type: req.body.type, userId: req.userId });
  // Dummy email implementation - would integrate SMTP later
  setTimeout(() => {
    logger.info('Email sent successfully (dummy)', { to: req.body.email });
  }, 1000);
  res.json({ status: 'success', message: 'Email sent successfully!' });
}));

// Error handling middleware
router.use((error, req, res, next) => {
  const context = req.route?.path || 'Unknown route';
  handleError(res, error, context);
});

export default router; 