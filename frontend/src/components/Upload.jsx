import { uploadPDF } from '../utils/api.js';
import { DocumentIcon, DownloadIcon, LoadingSpinner } from '../assets/icons/index.js';

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
          <DocumentIcon className="upload-document-icon" />
        </div>
        
        <h3 className="upload-title">Upload PDF Document</h3>
        <p className="upload-subtitle">
          Select a PDF file to extract and process data automatically
        </p>
        
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
          Choose PDF File
        </label>
      </div>
      
      {isLoading && (
        <div className="upload-status">
          <div className="alert alert-info">
            <div className="alert-content">
              <LoadingSpinner />
              🤖 Analyzing document with AI • Extracting key information...
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 