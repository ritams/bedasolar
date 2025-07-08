import express from 'express';
import multer from 'multer';
import { convertPdfToImage } from '../services/pdfProcessor.js';
import { parseImageWithLLM } from '../services/openRouter.js';
import { saveFormData } from '../services/mongodb.js';
import { generatePDF, generateHTML } from '../services/proposalGenerator.js';

const router = express.Router();
const upload = multer({ dest: 'backend/temp/' });

router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    console.log('📁 PDF upload started:', req.file?.originalname);
    
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    
    console.log('🔄 Converting PDF to image...');
    const imageBuffer = await convertPdfToImage(req.file.path);
    console.log('✅ PDF converted to image successfully');
    
    console.log('🤖 Parsing image with LLM...');
    const parsedData = await parseImageWithLLM(imageBuffer);
    console.log('✅ LLM parsing completed:', parsedData);
    
    res.json(parsedData);
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const result = await saveFormData(req.body, req.body.originalFilename);
    res.json({ status: 'success', _id: result._id });
  } catch (error) {
    console.error('❌ Submit error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body);
    const htmlContent = generateHTML(req.body);
    
    res.json({
      pdf: pdfBuffer.toString('base64'),
      html: htmlContent
    });
  } catch (error) {
    console.error('❌ Generate error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router; 