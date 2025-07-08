import mongoose from 'mongoose';

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
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

export const saveFormData = async (data, filename) => {
  const form = new ParsedForm({
    ...data,
    originalFilename: filename
  });
  return await form.save();
}; 