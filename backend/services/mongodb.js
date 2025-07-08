import mongoose from 'mongoose';
import logger from './logger.js';

const electricityBillSchema = new mongoose.Schema({
  // Customer Information
  customerName: { type: String, required: true },
  customerNumber: { type: String, required: true },
  supplierName: { type: String, default: '' },
  
  // Address Information
  billingAddress: { type: String, required: true },
  supplyAddress: { type: String, required: true },
  
  // Meter Information  
  nmi: { type: String, required: true }, // National Metering Identifier
  meterNumber: { type: String, required: true },
  
  // Usage Information
  peakUsage: { type: Number, default: 0 }, // kWh
  offPeakUsage: { type: Number, default: 0 }, // kWh
  dailySupplyCharge: { type: Number, default: 0 }, // days
  
  // Cost Information
  totalBillAmount: { type: Number, required: true }, // $
  averageDailyUsage: { type: Number, default: 0 }, // kWh
  averageDailyCost: { type: Number, default: 0 }, // $
  
  // Environmental
  greenhouseGasEmissions: { type: Number, default: 0 }, // kg
  
  // Billing Period
  billingPeriodStart: { type: String, default: '' },
  billingPeriodEnd: { type: String, default: '' },
  billingDays: { type: Number, default: 30 },
  
  // User Information
  userType: { type: String, enum: ['tenant', 'landlord', 'smb'], default: '' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  landlordName: { type: String, default: '' },
  landlordEmail: { type: String, default: '' },
  landlordPhone: { type: String, default: '' },
  futureConsumption: { type: Boolean, default: false },
  roofArea: { type: Number, default: 0 },
  
  // Metadata
  uploadTimestamp: { type: Date, default: Date.now },
  originalFilename: String
});

const ElectricityBill = mongoose.model('ElectricityBill', electricityBillSchema);

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
    const form = new ElectricityBill({
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

export const saveUserInfo = async (data) => {
  try {
    // Calculate dummy roof area
    const roofArea = Math.floor(100 + Math.random() * 200);
    
    const form = new ElectricityBill({
      ...data.billData,
      ...data,
      roofArea,
      originalFilename: data.billData?.originalFilename
    });
    const result = await form.save();
    logger.database('user-info-save', 'completed', { recordId: result._id, roofArea });
    return { ...result.toObject(), roofArea };
  } catch (error) {
    logger.database('user-info-save', 'error', { error: error.message });
    throw error;
  }
}; 