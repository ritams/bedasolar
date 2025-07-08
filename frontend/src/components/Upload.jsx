/**
 * Upload Component - Secure file upload with drag & drop support
 * Handles PDF file uploads with comprehensive validation and user feedback
 */
import React, { useCallback } from 'react';
import { uploadPDF } from '../utils/api.js';
import { validateFile } from '../utils/sanitize.js';
import { useAsync } from '../hooks/useAsync.js';
import { 
  DocumentIcon, 
  DownloadIcon, 
  LoadingSpinner, 
  LightningIcon, 
  SearchIcon, 
  SunIcon 
} from '../assets/icons/index.js';

/**
 * ProcessingSteps Component - Shows upload progress steps
 */
const ProcessingSteps = React.memo(({ currentStep = 0 }) => {
  const steps = [
    { label: 'Reading document', isActive: currentStep >= 0 },
    { label: 'Extracting data', isActive: currentStep >= 1 },
    { label: 'Analyzing usage', isActive: currentStep >= 2 }
  ];

  return (
    <div className="processing-steps-inline">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`processing-step-inline ${step.isActive ? 'active' : ''}`}
        >
          <span className="step-dot-inline" />
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
});

ProcessingSteps.displayName = 'ProcessingSteps';

/**
 * FeaturePills Component - Displays upload features
 */
const FeaturePills = React.memo(() => {
  const features = [
    { icon: LightningIcon, label: 'Quick Analysis' },
    { icon: SearchIcon, label: 'AI-Powered' },
    { icon: SunIcon, label: 'Solar Ready' }
  ];

  return (
    <div className="upload-features">
      {features.map(({ icon: Icon, label }, index) => (
        <div key={index} className="feature-pill">
          <Icon size={16} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
});

FeaturePills.displayName = 'FeaturePills';

/**
 * LoadingState Component - Shows processing animation
 */
const LoadingState = React.memo(() => (
  <div className="upload-processing-inline">
    <LoadingSpinner size={48} />
    <h3 className="processing-title">Analyzing with AI</h3>
    <p className="processing-subtitle">
      Extracting data from your electricity bill...
    </p>
    <ProcessingSteps />
  </div>
));

LoadingState.displayName = 'LoadingState';

/**
 * UploadArea Component - Main upload interface
 */
const UploadArea = React.memo(({ 
  onFileSelect, 
  isDragOver, 
  onDragHandlers,
  isProcessing 
}) => {
  if (isProcessing) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="upload-visual">
        <div className="upload-icon-wrapper">
          <DocumentIcon size={64} className="upload-document-icon" />
        </div>
        
        <h3 className="upload-title">Drop your bill here or browse</h3>
        <p className="upload-description">
          Supports PDF files up to 10MB. Your data is processed securely and never stored.
        </p>
      </div>

      <FeaturePills />

      <label htmlFor="file-upload" className="btn btn-primary btn-lg">
        <DownloadIcon size={20} />
        <span>Choose File</span>
      </label>
      
      <input
        id="file-upload"
        type="file"
        accept=".pdf"
        onChange={onFileSelect}
        className="hidden"
        aria-describedby="upload-description"
      />
      
      <p className="upload-note" id="upload-description">
        We'll analyze your bill to calculate potential solar savings
      </p>
    </>
  );
});

UploadArea.displayName = 'UploadArea';

/**
 * Main Upload Component
 */
export default function Upload({ onSuccess, isLoading, setIsLoading }) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  // Use the async hook for upload handling
  const { execute: executeUpload, loading } = useAsync(uploadPDF, false);

  /**
   * Handles file validation and upload
   */
  const handleFileUpload = useCallback(async (file) => {
    // Validate file before upload
    const validation = validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['application/pdf'],
      allowedExtensions: ['.pdf']
    });

    if (!validation.isValid) {
      alert(`Upload failed: ${validation.errors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeUpload(file);
      onSuccess(result.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  }, [executeUpload, onSuccess, setIsLoading]);

  /**
   * File input change handler
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  /**
   * Drag and drop handlers
   */
  const dragHandlers = {
    onDragOver: useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }, []),

    onDragLeave: useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    }, []),

    onDrop: useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      
      const files = e.dataTransfer?.files;
      if (files?.length > 0) {
        handleFileUpload(files[0]);
      }
    }, [handleFileUpload])
  };

  return (
    <div className="upload-section">
      <div className="step-header">
        <h1 className="step-title">Upload Your Electricity Bill</h1>
        <p className="step-subtitle">
          Let's start by analyzing your energy usage. Upload your latest 
          electricity bill to get instant solar savings calculations.
        </p>
      </div>

      <div 
        className={`upload-area ${isLoading ? 'processing' : ''} ${isDragOver ? 'drag-over' : ''}`}
        {...dragHandlers}
        role="button"
        tabIndex={0}
        aria-label="Upload electricity bill PDF file"
        aria-describedby="upload-description"
      >
        <UploadArea
          onFileSelect={handleFileChange}
          isDragOver={isDragOver}
          onDragHandlers={dragHandlers}
          isProcessing={isLoading}
        />
      </div>
    </div>
  );
} 