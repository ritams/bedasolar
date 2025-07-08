import { uploadPDF } from '../utils/api.js';
import { DocumentIcon, DownloadIcon, LoadingSpinner, LightningIcon, SearchIcon, SunIcon } from '../assets/icons/index.js';
import { useState } from 'react';

export default function Upload({ onSuccess, isLoading, setIsLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await uploadPDF(file);
      onSuccess(data);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="upload-section">
      <div className="step-header">
        <h1 className="step-title">Upload Your Electricity Bill</h1>
        <p className="step-subtitle">
          Let's start by analyzing your energy usage. Upload your latest electricity bill to get instant solar savings calculations.
        </p>
      </div>

      <div 
        className={`upload-area ${isLoading ? 'processing' : ''} ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload electricity bill PDF file"
        aria-describedby="upload-description"
      >
        {isLoading ? (
          <div className="upload-processing-inline">
            <LoadingSpinner size={48} />
            <h3 className="processing-title">Analyzing with AI</h3>
            <p className="processing-subtitle">Extracting data from your electricity bill...</p>
            
            <div className="processing-steps-inline">
              <div className="processing-step-inline active">
                <span className="step-dot-inline"></span>
                <span>Reading document</span>
              </div>
              <div className="processing-step-inline">
                <span className="step-dot-inline"></span>
                <span>Extracting data</span>
              </div>
              <div className="processing-step-inline">
                <span className="step-dot-inline"></span>
                <span>Analyzing usage</span>
              </div>
            </div>
          </div>
        ) : (
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

            <div className="upload-features">
              <div className="feature-pill">
                <LightningIcon size={16} />
                <span>Quick Analysis</span>
              </div>
              <div className="feature-pill">
                <SearchIcon size={16} />
                <span>AI-Powered</span>
              </div>
              <div className="feature-pill">
                <SunIcon size={16} />
                <span>Solar Ready</span>
              </div>
            </div>

            <label htmlFor="file-upload" className="btn btn-primary btn-lg">
              <DownloadIcon size={20} />
              <span>Choose File</span>
            </label>
            
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              aria-describedby="upload-description"
            />
            
            <p className="upload-note" id="upload-description">
              We'll analyze your bill to calculate potential solar savings
            </p>
          </>
        )}
      </div>
    </div>
  );
} 