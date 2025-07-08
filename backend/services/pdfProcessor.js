import { fromPath } from 'pdf2pic';
import sharp from 'sharp';
import fs from 'fs/promises';
import logger from './logger.js';

export const convertPdfToImages = async (pdfPath) => {
  const convert = fromPath(pdfPath, {
    density: 150,
    saveFilename: "page",
    savePath: "./backend/temp/",
    format: "png",
    width: 1024,
    height: 1024
  });

  try {
    // Convert all pages (pdf2pic automatically handles multiple pages)
    const results = await convert.bulk(-1); // -1 means all pages
    logger.debug('PDF conversion results:', { pageCount: results.length });
    
    const imageBuffers = [];
    
    // Process each page
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const imagePath = result.path;
      
      // Read and resize the image
      const imageBuffer = await fs.readFile(imagePath);
      const resizedBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();
      
      imageBuffers.push(resizedBuffer);
      
      // Clean up temp image file
      await fs.unlink(imagePath).catch(() => {});
    }
    
    // Clean up PDF file
    await fs.unlink(pdfPath).catch(() => {});
    
    return imageBuffers;
    
  } catch (error) {
    // Clean up on error
    await fs.unlink(pdfPath).catch(() => {});
    throw error;
  }
}; 