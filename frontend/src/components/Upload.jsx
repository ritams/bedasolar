import { uploadPDF } from '../utils/api.js';
import { DocumentIcon, DownloadIcon, LoadingSpinner, LightningIcon, SearchIcon, SunIcon, CpuIcon } from '../assets/icons/index.js';

export default function Upload({ onSuccess, isLoading, setIsLoading }) {
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
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

  return (
    <div>
      <div className="upload-zone">
        <div className="upload-icon">
          <DocumentIcon className="upload-document-icon" size={48} />
        </div>
        
        <h3 className="upload-title">Upload Your Electricity Bill</h3>
        <p className="upload-subtitle">
          Upload your latest electricity bill to analyze your energy usage and calculate solar savings
        </p>
        
        <div className="upload-features">
          <div className="feature-item">
            <LightningIcon size={20} />
            <span>Multi-page bill support</span>
          </div>
          <div className="feature-item">
            <SearchIcon size={20} />
            <span>AI-powered data extraction</span>
          </div>
          <div className="feature-item">
            <SunIcon size={20} />
            <span>Instant solar savings analysis</span>
          </div>
        </div>
        
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isLoading}
          id="file-upload"
          className="upload-input"
        />
        
        <label htmlFor="file-upload" className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}>
          <DownloadIcon />
          Choose Electricity Bill (PDF)
        </label>
        
        <p className="upload-note">
          Supported: PDF files • Multiple pages supported • Secure processing
        </p>
      </div>
      
      {isLoading && (
        <div className="upload-status">
          <div className="alert alert-info">
            <div className="alert-content">
              <LoadingSpinner />
              <CpuIcon size={20} />
              <span>Analyzing your electricity bill with AI • Extracting usage data for solar analysis...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 