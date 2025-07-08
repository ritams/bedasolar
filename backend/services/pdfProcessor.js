import { fromPath } from 'pdf2pic';
import sharp from 'sharp';
import fs from 'fs/promises';
import logger from './logger.js';

export const convertPdfToImage = async (pdfPath) => {
  const convert = fromPath(pdfPath, {
    density: 150,
    saveFilename: "page",
    savePath: "./backend/temp/",
    format: "png",
    width: 1024,
    height: 1024
  });

  const result = await convert(1);
  logger.debug('PDF conversion result:', result);
  
  // Read the generated image file
  const imagePath = result.path;
  const imageBuffer = await fs.readFile(imagePath);
  
  // Resize if needed
  const resizedBuffer = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();

  // Clean up temp files
  await fs.unlink(pdfPath).catch(() => {});
  await fs.unlink(imagePath).catch(() => {});
  
  return resizedBuffer;
}; 