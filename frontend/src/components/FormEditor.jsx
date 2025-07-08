import { useState } from 'react'
import { submitForm } from '../utils/api.js'
import { downloadProposalAsPDF } from '../utils/download.js'
import { useMessage } from '../hooks/useMessage.js'
import { SaveIcon, DocumentIcon, RefreshIcon, LoadingSpinner, DownloadIcon, SunIcon, DollarIcon, LeafIcon, LightningIcon, HomeIcon } from '../assets/icons/index.js'

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
      showMessage('Electricity bill data saved successfully!', 'success')
    } catch (error) {
      showMessage('Save failed: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateProposal = () => {
    setShowProposal(true)
    showMessage('Solar proposal generated successfully!', 'success')
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await downloadProposalAsPDF('proposal-content', `BEDA-Solar-Proposal-${formData.customerNumber}.pdf`)
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

  // Calculate potential solar savings (placeholder calculation)
  const calculatePotentialSavings = () => {
    const annualUsage = (formData.averageDailyUsage || 0) * 365
    const annualCost = (formData.averageDailyCost || 0) * 365
    const solarSavings = annualCost * 0.7 // Assume 70% savings
    return { annualUsage, annualCost, solarSavings }
  }

  // Show solar proposal if generated
  if (showProposal) {
    const { annualUsage, annualCost, solarSavings } = calculatePotentialSavings()
    
    return (
      <div>
        <div className="form-header">
          <h2 className="form-header-title">
            <SunIcon size={32} className="form-header-icon" />
            BEDA Solar Proposal
          </h2>
          <p className="form-header-subtitle">
            Customized solar solution based on your electricity bill analysis
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
                <h1>BEDA SOLAR</h1>
                <p>Clean Energy Solutions • Powering Your Future</p>
              </div>
            </div>

            {/* Title Section */}
            <div className="proposal-title-section">
              <h2>SOLAR INSTALLATION PROPOSAL</h2>
              <div className="proposal-date">Generated on {getCurrentDate()}</div>
            </div>

            {/* Customer Information */}
            <div className="proposal-section">
              <h3>CUSTOMER INFORMATION</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Customer:</strong> {formData.customerName}
                </div>
                <div className="info-item">
                  <strong>Account #:</strong> {formData.customerNumber}
                </div>
                <div className="info-item">
                  <strong>Supplier:</strong> {formData.supplierName}
                </div>
                <div className="info-item">
                  <strong>NMI:</strong> {formData.nmi}
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="proposal-section">
              <h3>PROPERTY DETAILS</h3>
              <div className="address-box">
                <strong>Installation Address:</strong><br/>
                {formData.supplyAddress || formData.billingAddress}
              </div>
            </div>

            {/* Energy Analysis */}
            <div className="proposal-section">
              <h3>ENERGY CONSUMPTION ANALYSIS</h3>
              <div className="energy-stats">
                <div className="stat-item">
                  <span className="stat-label">Peak Usage:</span>
                  <span className="stat-value">{formData.peakUsage} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Off-Peak Usage:</span>
                  <span className="stat-value">{formData.offPeakUsage} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Daily Average:</span>
                  <span className="stat-value">{formData.averageDailyUsage} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Daily Cost:</span>
                  <span className="stat-value">${formData.averageDailyCost}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Annual Usage:</span>
                  <span className="stat-value">{annualUsage.toFixed(0)} kWh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Annual Cost:</span>
                  <span className="stat-value">${annualCost.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Solar Benefits */}
            <div className="proposal-section">
              <h3>SOLAR BENEFITS & SAVINGS</h3>
              <div className="benefits-box">
                <div className="benefit-item">
                  <DollarIcon className="benefit-icon" size={24} />
                  <span><strong>Estimated Annual Savings:</strong> ${solarSavings.toFixed(0)}</span>
                </div>
                <div className="benefit-item">
                  <LeafIcon className="benefit-icon" size={24} />
                  <span><strong>CO2 Reduction:</strong> {formData.greenhouseGasEmissions}kg+ annually</span>
                </div>
                <div className="benefit-item">
                  <LightningIcon className="benefit-icon" size={24} />
                  <span><strong>Energy Independence:</strong> Reduce grid dependency by 70%+</span>
                </div>
                <div className="benefit-item">
                  <HomeIcon className="benefit-icon" size={24} />
                  <span><strong>Property Value:</strong> Increase home value up to 4%</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="proposal-section">
              <h3>NEXT STEPS</h3>
              <div className="proposal-text">
                <p>Dear {formData.customerName},</p>
                <p>Based on your electricity bill analysis, BEDA Solar can help you save approximately <strong>${solarSavings.toFixed(0)} annually</strong> with a custom solar installation.</p>
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Schedule free rooftop assessment</li>
                  <li>Custom system design & quote</li>
                  <li>Government rebate assistance</li>
                  <li>Professional installation</li>
                </ol>
                <p>Contact us today to start your solar journey!</p>
              </div>
            </div>

            {/* Footer */}
            <div className="proposal-footer">
              <div className="footer-content">
                <p><strong>BEDA SOLAR - Clean Energy Solutions</strong></p>
                <p>Contact: 1300-BEDA-SOLAR • info@bedasolar.com.au</p>
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
                Download Solar Proposal
              </>
            )}
          </button>
          
          <button onClick={handleBackToForm} className="btn btn-secondary">
            <RefreshIcon />
            Edit Bill Data
          </button>
          
          <button onClick={onReset} className="btn btn-secondary">
            <RefreshIcon />
            Upload New Bill
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="form-header">
        <h2 className="form-header-title">⚡ Electricity Bill Analysis</h2>
        <p className="form-header-subtitle">
          Review and edit extracted data from your electricity bill for solar assessment
        </p>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Information Section */}
        <div className="form-section">
          <h3>👤 Customer Information</h3>
          
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.customerName || ''} 
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
              placeholder="Full customer name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Customer Number *</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.customerNumber || ''} 
              onChange={(e) => handleChange('customerNumber', e.target.value)}
              required
              placeholder="Customer account number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Electricity Supplier</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.supplierName || ''} 
              onChange={(e) => handleChange('supplierName', e.target.value)}
              placeholder="Energy company name"
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="form-section">
          <h3>🏠 Property Information</h3>
          
          <div className="form-group">
            <label className="form-label">Billing Address *</label>
            <textarea 
              className="form-textarea"
              value={formData.billingAddress || ''} 
              onChange={(e) => handleChange('billingAddress', e.target.value)}
              required
              rows={2}
              placeholder="Customer billing address"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Supply Address *</label>
            <textarea 
              className="form-textarea"
              value={formData.supplyAddress || ''} 
              onChange={(e) => handleChange('supplyAddress', e.target.value)}
              required
              rows={2}
              placeholder="Electricity supply address (installation location)"
            />
          </div>
        </div>

        {/* Meter Information Section */}
        <div className="form-section">
          <h3>🔌 Meter Information</h3>
          
          <div className="form-group">
            <label className="form-label">NMI (National Metering Identifier) *</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.nmi || ''} 
              onChange={(e) => handleChange('nmi', e.target.value)}
              required
              placeholder="10-11 digit NMI number"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Meter Number *</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.meterNumber || ''} 
              onChange={(e) => handleChange('meterNumber', e.target.value)}
              required
              placeholder="Electricity meter number"
            />
          </div>
        </div>

        {/* Usage Information Section */}
        <div className="form-section">
          <h3>📊 Energy Usage Data</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Peak Usage (kWh)</label>
              <input 
                type="number" 
                step="0.001"
                className="form-input"
                value={formData.peakUsage || ''} 
                onChange={(e) => handleChange('peakUsage', parseFloat(e.target.value) || 0)}
                placeholder="0.000"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Off-Peak Usage (kWh)</label>
              <input 
                type="number" 
                step="0.001"
                className="form-input"
                value={formData.offPeakUsage || ''} 
                onChange={(e) => handleChange('offPeakUsage', parseFloat(e.target.value) || 0)}
                placeholder="0.000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Daily Supply Charge (days)</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.dailySupplyCharge || ''} 
                onChange={(e) => handleChange('dailySupplyCharge', parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Billing Days</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.billingDays || ''} 
                onChange={(e) => handleChange('billingDays', parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>
          </div>
        </div>

        {/* Cost Information Section */}
        <div className="form-section">
          <h3>💰 Cost Analysis</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Bill Amount ($) *</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.totalAmount || ''} 
                onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Average Daily Cost ($)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.averageDailyCost || ''} 
                onChange={(e) => handleChange('averageDailyCost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Average Daily Usage (kWh)</label>
              <input 
                type="number" 
                step="0.001"
                className="form-input"
                value={formData.averageDailyUsage || ''} 
                onChange={(e) => handleChange('averageDailyUsage', parseFloat(e.target.value) || 0)}
                placeholder="0.000"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Greenhouse Gas Emissions (kg)</label>
              <input 
                type="number" 
                step="0.001"
                className="form-input"
                value={formData.greenhouseGasEmissions || ''} 
                onChange={(e) => handleChange('greenhouseGasEmissions', parseFloat(e.target.value) || 0)}
                placeholder="0.000"
              />
            </div>
          </div>
        </div>

        {/* Billing Period Section */}
        <div className="form-section">
          <h3>📅 Billing Period</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Billing Period Start</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.billingPeriodStart || ''} 
                onChange={(e) => handleChange('billingPeriodStart', e.target.value)}
                placeholder="e.g., 16 Feb 2025"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Billing Period End</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.billingPeriodEnd || ''} 
                onChange={(e) => handleChange('billingPeriodEnd', e.target.value)}
                placeholder="e.g., 17 Mar 2025"
              />
            </div>
          </div>
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
                Save Bill Data
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleGenerateProposal}
            className="btn btn-primary"
          >
            <DocumentIcon size={16} />
            Generate Solar Proposal
          </button>
          
          <button type="button" onClick={onReset} className="btn btn-secondary">
            <RefreshIcon />
            Upload New Bill
          </button>
        </div>
      </form>
    </div>
  )
} 