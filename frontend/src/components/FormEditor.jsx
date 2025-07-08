import { useState } from 'react'
import { submitForm } from '../utils/api.js'
import { downloadProposalAsPDF } from '../utils/download.js'
import { sendEmail } from '../utils/api.js'
import { useMessage } from '../hooks/useMessage.js'
import { SaveIcon, DocumentIcon, RefreshIcon, LoadingSpinner, DownloadIcon, SunIcon, DollarIcon, LeafIcon, LightningIcon, HomeIcon } from '../assets/icons/index.js'

export default function FormEditor({ initialData, onConfirm, onReset, userInfo, showProposal = false }) {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)
  const { message, showMessage } = useMessage()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (showProposal) {
        await submitForm(formData)
        showMessage('Electricity bill data saved successfully!', 'success')
      } else {
        showMessage('Bill data confirmed!', 'success')
        onConfirm(formData)
      }
    } catch (error) {
      showMessage('Save failed: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateProposal = async () => {
    try {
      // Calculate roof area (dummy for now)
      const roofArea = Math.floor(100 + Math.random() * 200) // 100-300 sq meters
      showMessage(`Roof area calculated: ${roofArea}m² - Solar proposal generated!`, 'success')
    } catch (error) {
      showMessage('Roof calculation failed: ' + error.message, 'error')
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      // Give a moment for the UI to update before generating PDF
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const filename = `BEDA-Solar-Proposal-${formData.customerNumber || 'Custom'}.pdf`
      await downloadProposalAsPDF('proposal-content', filename)
      
      showMessage('PDF downloaded successfully!', 'success')
    } catch (error) {
      console.error('PDF Download Error:', error)
      showMessage('Download failed. Please try again.', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    setIsEmailing(true)
    try {
      // Determine recipient email
      const recipientEmail = userInfo?.userType === 'tenant' && userInfo.landlordEmail 
        ? userInfo.landlordEmail 
        : userInfo?.contactEmail
      
      if (!recipientEmail) {
        throw new Error('No email address available')
      }
      
      const emailData = {
        email: recipientEmail,
        type: 'proposal',
        customerName: userInfo?.contactName || formData.customerName || 'Customer',
        proposalData: {
          systemSize,
          monthlySavings,
          annualSavings: Math.round(solarSavings),
          roofArea
        }
      }
      
      await sendEmail(emailData)
      showMessage(`Proposal sent to ${recipientEmail} successfully!`, 'success')
    } catch (error) {
      console.error('Email Send Error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Email send failed'
      showMessage(`Email failed: ${errorMessage}`, 'error')
    } finally {
      setIsEmailing(false)
    }
  }

  const handleBackToForm = () => {
    // This function is no longer needed in the new flow
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
    const monthlyUsage = Math.round(annualUsage / 12)
    const monthlySavings = Math.round(solarSavings / 12)
    const roofArea = userInfo?.roofArea || 150
    const systemSize = Math.round(roofArea * 0.15) // ~150W per sqm
    const co2Reduction = Math.round(annualUsage * 0.82) // kg CO2 per kWh in Australia
    const treesEquivalent = Math.round(co2Reduction / 22) // 22kg CO2 per tree per year
    
    return (
      <div className="proposal-page" id="proposal-content">
        {/* Message Alert */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        {/* Clean Hero Section */}
        <div className="proposal-hero-clean">
          <div className="hero-content-clean">
            <div className="hero-badge">
              <SunIcon size={16} />
              <span>Your Personalized Solar Solution</span>
            </div>
            
            <h1 className="hero-title-clean">
              Start Saving <span className="savings-amount">${monthlySavings}</span> Every Month
            </h1>
            
            <p className="hero-subtitle">
              Custom {systemSize}kW solar system for {userInfo?.contactName || formData.customerName}
            </p>

            {/* Primary CTA */}
            <div className="hero-actions">
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="btn btn-primary btn-xl"
              >
                {isDownloading ? <LoadingSpinner size={20} /> : <DownloadIcon size={20} />}
                <span>{isDownloading ? 'Generating PDF...' : 'Download Your Proposal'}</span>
              </button>
              
              <button 
                onClick={handleSendEmail}
                disabled={isEmailing}
                className="btn btn-secondary btn-lg"
              >
                {isEmailing ? <LoadingSpinner size={16} /> : <SaveIcon size={16} />}
                <span>{isEmailing ? 'Sending...' : 'Email This Proposal'}</span>
              </button>
            </div>
          </div>
          
          {/* Key Stats Cards */}
          <div className="stats-overview">
            <div className="stat-card-primary">
              <div className="stat-icon">
                <DollarIcon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number">${Math.round(solarSavings).toLocaleString()}</div>
                <div className="stat-label">Annual Savings</div>
              </div>
            </div>
            
            <div className="stat-card-primary">
              <div className="stat-icon">
                <SunIcon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{systemSize}kW</div>
                <div className="stat-label">System Size</div>
              </div>
            </div>
            
            <div className="stat-card-primary">
              <div className="stat-icon">
                <LeafIcon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{treesEquivalent}</div>
                <div className="stat-label">Trees Equivalent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Grid - Simplified */}
        <div className="analysis-section">
          <h2 className="section-title">Your Solar Impact Analysis</h2>
          
          <div className="analysis-grid">
            {/* Financial Analysis */}
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">
                  <DollarIcon size={24} />
                </div>
                <h3>Financial Impact</h3>
              </div>
              
              <div className="cost-comparison">
                <div className="cost-item current">
                  <span className="cost-label">Current Monthly Bill</span>
                  <span className="cost-amount">${Math.round(annualCost / 12)}</span>
                </div>
                <div className="arrow-down">↓</div>
                <div className="cost-item future">
                  <span className="cost-label">With Solar</span>
                  <span className="cost-amount">${Math.round(annualCost / 12) - monthlySavings}</span>
                </div>
                <div className="savings-highlight">
                  Save ${monthlySavings}/month
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">
                  <LeafIcon size={24} />
                </div>
                <h3>Environmental Impact</h3>
              </div>
              
              <div className="environmental-metrics">
                <div className="metric">
                  <span className="metric-number">{Math.round(co2Reduction / 1000)}t</span>
                  <span className="metric-label">CO₂ Reduced Annually</span>
                </div>
                <div className="metric">
                  <span className="metric-number">{treesEquivalent}</span>
                  <span className="metric-label">Tree Equivalents</span>
                </div>
              </div>
            </div>

            {/* System Details */}
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">
                  <LightningIcon size={24} />
                </div>
                <h3>System Overview</h3>
              </div>
              
              <div className="system-specs">
                <div className="spec-row">
                  <span className="spec-label">System Size</span>
                  <span className="spec-value">{systemSize}kW</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Panel Count</span>
                  <span className="spec-value">~{Math.round(systemSize * 2.5)}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Roof Coverage</span>
                  <span className="spec-value">{Math.round(roofArea * 0.85)}m²</span>
                </div>
                <div className="payback-info">
                  <span className="payback-label">Payback Period</span>
                  <span className="payback-value">6-8 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Information */}
        <div className="installation-section">
          <h2 className="section-title">Installation Details</h2>
          
          <div className="installation-grid">
            <div className="info-card">
              <div className="info-header">
                <HomeIcon size={18} />
                <h4>Property Information</h4>
              </div>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Customer</span>
                  <span className="value">{formData.customerName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Property Type</span>
                  <span className="value">{userInfo?.userType?.charAt(0).toUpperCase() + userInfo?.userType?.slice(1) || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address</span>
                  <span className="value">{formData.supplyAddress || formData.billingAddress}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-header">
                <DocumentIcon size={18} />
                <h4>Contact Information</h4>
              </div>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{userInfo?.contactEmail || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value">{userInfo?.contactPhone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Best Contact Time</span>
                  <span className="value">{userInfo?.contactTime || 'Any time'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps - Streamlined */}
        <div className="next-steps">
          <h2 className="section-title">What Happens Next?</h2>
          
          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Free Site Assessment</h4>
                <p>Professional roof evaluation</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Custom Design</h4>
                <p>System optimization & permits</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Professional Installation</h4>
                <p>Certified technician setup</p>
              </div>
            </div>
          </div>
          
          <div className="timeline-summary">
            <strong>Timeline:</strong> Complete installation in 4-6 weeks from approval
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="secondary-actions">
          <button onClick={onReset} className="btn btn-ghost">
            <RefreshIcon size={16} />
            <span>Start New Analysis</span>
          </button>
        </div>

        {/* Clean Footer */}
        <div className="proposal-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <SunIcon size={20} />
              <span>BEDA Solar</span>
            </div>
            <div className="footer-info">
              <span>Clean Energy Solutions • Powering Australia's Future</span>
              <span className="generation-date">Generated {getCurrentDate()}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="step-header">
        <h1 className="step-title">
          <LightningIcon size={24} />
          Electricity Bill Analysis
        </h1>
        <p className="step-subtitle">
          Review and edit extracted data from your electricity bill for solar assessment
        </p>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="modern-form">
        {/* Customer & Property Information - Combined Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Customer Information
          </h3>
          <div className="form-grid-3">
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
        </div>

        {/* Property Information Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Property Information
          </h3>
          
          <div className="form-group">
            <label className="form-label">Billing Address *</label>
            <textarea 
              className="form-input"
              value={formData.billingAddress || ''} 
              onChange={(e) => handleChange('billingAddress', e.target.value)}
              required
              placeholder="Full billing address"
              rows="2"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Supply Address *</label>
            <textarea 
              className="form-input"
              value={formData.supplyAddress || ''} 
              onChange={(e) => handleChange('supplyAddress', e.target.value)}
              required
              placeholder="Property address where electricity is supplied"
              rows="2"
            />
          </div>
        </div>

        {/* Meter Information Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Meter Information
          </h3>
          <div className="form-grid-2">
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
                placeholder="Meter identification number"
              />
            </div>
          </div>
        </div>

        {/* Energy Usage Data Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Energy Usage Data
          </h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Peak Usage (kWh)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.peakUsage || ''} 
                onChange={(e) => handleChange('peakUsage', e.target.value)}
                placeholder="Peak rate consumption"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Off-Peak Usage (kWh)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.offPeakUsage || ''} 
                onChange={(e) => handleChange('offPeakUsage', e.target.value)}
                placeholder="Off-peak consumption"
              />
            </div>
          </div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Daily Supply Charge (days)</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.dailySupplyCharge || ''} 
                onChange={(e) => handleChange('dailySupplyCharge', e.target.value)}
                placeholder="Number of billing days"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Days</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.billingDays || ''} 
                onChange={(e) => handleChange('billingDays', e.target.value)}
                placeholder="Billing period length"
              />
            </div>
          </div>
        </div>

        {/* Cost Analysis Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Cost Analysis
          </h3>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Total Bill Amount ($) *</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.totalBillAmount || ''} 
                onChange={(e) => handleChange('totalBillAmount', e.target.value)}
                required
                placeholder="Total amount due"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Daily Cost ($)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.averageDailyCost || ''} 
                onChange={(e) => handleChange('averageDailyCost', e.target.value)}
                placeholder="Daily average cost"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Daily Usage (kWh)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                value={formData.averageDailyUsage || ''} 
                onChange={(e) => handleChange('averageDailyUsage', e.target.value)}
                placeholder="Daily kWh usage"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Greenhouse Gas Emissions (kg)</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.greenhouseGasEmissions || ''} 
              onChange={(e) => handleChange('greenhouseGasEmissions', e.target.value)}
              placeholder="CO2 equivalent emissions"
            />
          </div>
        </div>

        {/* Billing Period Section */}
        <div className="form-floating-section">
          <h3 className="section-title">
            Billing Period
          </h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Billing Period Start</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.billingPeriodStart || ''} 
                onChange={(e) => handleChange('billingPeriodStart', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Period End</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.billingPeriodEnd || ''} 
                onChange={(e) => handleChange('billingPeriodEnd', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-actions-floating">
          <button type="button" onClick={onReset} className="btn btn-secondary">
            <RefreshIcon size={20} />
            <span>Upload New Bill</span>
          </button>
          
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            {isSaving ? (
              <>
                <LoadingSpinner />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <SaveIcon size={20} />
                <span>Confirm Bill Data</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 