import { useState } from 'react'
import { submitForm } from '../utils/api.js'
import { downloadProposalAsPDF } from '../utils/download.js'
import { useMessage } from '../hooks/useMessage.js'
import { SaveIcon, DocumentIcon, RefreshIcon, LoadingSpinner, DownloadIcon } from '../assets/icons/index.js'

export default function FormEditor({ initialData, onReset }) {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [showProposal, setShowProposal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { message, showMessage } = useMessage()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await submitForm(formData)
      showMessage('Data saved successfully!', 'success')
    } catch (error) {
      showMessage('Save failed: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateProposal = () => {
    setShowProposal(true)
    showMessage('Proposal generated successfully!', 'success')
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await downloadProposalAsPDF('proposal-content', `BEDA-Proposal-${formData.invoiceNumber}.pdf`)
      showMessage('PDF downloaded successfully!', 'success')
    } catch (error) {
      showMessage('Download failed: ' + error.message, 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleBackToForm = () => {
    setShowProposal(false)
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Show proposal preview if generated
  if (showProposal) {
    return (
      <div>
        <div className="form-header">
          <h2 className="form-header-title">📄 Generated Proposal Preview</h2>
          <p className="form-header-subtitle">
            Review your proposal exactly as it will appear in the PDF
          </p>
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="proposal-preview">
          <div className="proposal-content" id="proposal-content">
            {/* Header Section */}
            <div className="proposal-header">
              <div className="proposal-brand">
                <h1>BEDA</h1>
                <p>Different by Design • Professional Document Solutions</p>
              </div>
            </div>

            {/* Title Section */}
            <div className="proposal-title-section">
              <h2>BUSINESS PROPOSAL</h2>
              <div className="proposal-date">Generated on {getCurrentDate()}</div>
            </div>

            {/* Client Information */}
            <div className="proposal-section">
              <h3>CLIENT INFORMATION</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Name:</strong> {formData.name}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="info-item">
                  <strong>Invoice #:</strong> {formData.invoiceNumber}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="proposal-section">
              <h3>BILLING ADDRESS</h3>
              <div className="address-box">
                {formData.address}
              </div>
            </div>

            {/* Proposal Details */}
            <div className="proposal-section">
              <h3>PROPOSAL DETAILS</h3>
              <div className="proposal-text">
                <p>Dear {formData.name},</p>
                <p>We are pleased to submit this proposal based on your requirements. Our team at BEDA is committed to delivering exceptional results that exceed your expectations.</p>
                <p>Please feel free to contact us at {formData.email} for any questions or clarifications.</p>
              </div>
            </div>

            {/* Services Section */}
            <div className="proposal-section">
              <h3>OUR SERVICES</h3>
              <div className="services-list">
                <div className="service-item">✓ Intelligent Document Processing</div>
                <div className="service-item">✓ AI-Powered Data Extraction</div>
                <div className="service-item">✓ Professional Proposal Generation</div>
                <div className="service-item">✓ Streamlined Workflow Solutions</div>
              </div>
            </div>

            {/* Footer */}
            <div className="proposal-footer">
              <div className="footer-content">
                <p><strong>BEDA - Different by Design</strong></p>
                <p>Intelligent Document Solutions • Professional Service Excellence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="btn btn-primary"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner />
                Downloading...
              </>
            ) : (
              <>
                <DownloadIcon />
                Download PDF
              </>
            )}
          </button>
          
          <button onClick={handleBackToForm} className="btn btn-secondary">
            <RefreshIcon />
            Edit Form
          </button>
          
          <button onClick={onReset} className="btn btn-secondary">
            <RefreshIcon />
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="form-header">
        <h2 className="form-header-title">📋 Extracted Data</h2>
        <p className="form-header-subtitle">
          Review and edit the extracted information before saving or generating proposal
        </p>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input 
            type="text" 
            className="form-input"
            value={formData.name || ''} 
            onChange={(e) => handleChange('name', e.target.value)}
            required
            placeholder="Enter full name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input 
            type="email" 
            className="form-input"
            value={formData.email || ''} 
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="Enter email address"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Address *</label>
          <textarea 
            className="form-textarea"
            value={formData.address || ''} 
            onChange={(e) => handleChange('address', e.target.value)}
            required
            rows={3}
            placeholder="Enter complete address"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Invoice Number *</label>
          <input 
            type="text" 
            className="form-input"
            value={formData.invoiceNumber || ''} 
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            required
            placeholder="Enter invoice number"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            {isSaving ? (
              <>
                <LoadingSpinner />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon />
                Save Data
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleGenerateProposal}
            className="btn btn-primary"
          >
            <DocumentIcon size={16} />
            Generate Proposal
          </button>
          
          <button type="button" onClick={onReset} className="btn btn-secondary">
            <RefreshIcon />
            Start Over
          </button>
        </div>
      </form>
    </div>
  )
} 