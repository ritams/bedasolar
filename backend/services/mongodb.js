import mongoose from 'mongoose';
import logger from './logger.js';

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  uploadTimestamp: { type: Date, default: Date.now },
  originalFilename: String
});

const ParsedForm = mongoose.model('ParsedForm', formSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.database('connection', 'connected');
  } catch (error) {
    logger.database('connection', 'error', { error: error.message });
    throw error;
  }
};

export const saveFormData = async (data, filename) => {
  try {
    const form = new ParsedForm({
      ...data,
      originalFilename: filename
    });
    const result = await form.save();
    logger.database('save', 'completed', { recordId: result._id });
    return result;
  } catch (error) {
    logger.database('save', 'error', { error: error.message });
    throw error;
  }
}; 