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
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        {/* Enhanced Hero Section */}
        <div className="proposal-hero-enhanced">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-pattern"></div>
          </div>
          
          <div className="hero-content-enhanced">
            <div className="hero-main">
              <div className="hero-badge-enhanced">
                <SunIcon size={20} />
                <span>Your Personalized Solar Solution</span>
              </div>
              
              <h1 className="hero-title-enhanced">
                Start Saving <span className="savings-highlight-enhanced">${monthlySavings}</span>
                <span className="savings-period">every month</span>
              </h1>
              
              <p className="hero-description">
                Custom-designed {systemSize}kW solar system for {userInfo?.contactName || formData.customerName}
              </p>

              <div className="savings-callout">
                <div className="callout-main">
                  <span className="callout-amount">${Math.round(solarSavings).toLocaleString()}</span>
                  <span className="callout-label">Annual Savings</span>
                </div>
                <div className="callout-sub">
                  <span>Estimated payback: 6-8 years</span>
                </div>
              </div>
            </div>

            <div className="hero-stats-enhanced">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <SunIcon size={28} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{systemSize}kW</div>
                  <div className="stat-label">System Size</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <DollarIcon size={28} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">${monthlySavings}</div>
                  <div className="stat-label">Monthly Savings</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <LeafIcon size={28} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{treesEquivalent}</div>
                  <div className="stat-label">Trees CO₂ Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Analysis - Redesigned */}
        <div className="analysis-section-enhanced">
          <div className="section-header-enhanced">
            <h2>Your Energy Analysis</h2>
            <p>Complete breakdown of your current usage and solar potential</p>
          </div>

          <div className="analysis-grid-enhanced">
            {/* Current Usage Card */}
            <div className="analysis-card usage-card">
              <div className="card-header-enhanced">
                <div className="card-icon-enhanced">
                  <LightningIcon size={24} />
                </div>
                <div className="card-title-enhanced">
                  <h3>Current Energy Usage</h3>
                  <p>{monthlyUsage} kWh per month</p>
                </div>
              </div>
              
              <div className="usage-breakdown-enhanced">
                <div className="usage-item-enhanced">
                  <div className="usage-type">
                    <span className="usage-dot peak"></span>
                    <span>Peak Hours</span>
                  </div>
                  <div className="usage-amount">{formData.peakUsage} kWh</div>
                </div>
                <div className="usage-item-enhanced">
                  <div className="usage-type">
                    <span className="usage-dot off-peak"></span>
                    <span>Off-Peak</span>
                  </div>
                  <div className="usage-amount">{formData.offPeakUsage} kWh</div>
                </div>
              </div>
            </div>

            {/* Financial Impact Card */}
            <div className="analysis-card financial-card">
              <div className="card-header-enhanced">
                <div className="card-icon-enhanced">
                  <DollarIcon size={24} />
                </div>
                <div className="card-title-enhanced">
                  <h3>Financial Impact</h3>
                  <p>Your potential savings with solar</p>
                </div>
              </div>
              
              <div className="financial-comparison">
                <div className="comparison-item before">
                  <div className="comparison-label">Current Bill</div>
                  <div className="comparison-amount">${Math.round(annualCost / 12)}</div>
                  <div className="comparison-period">per month</div>
                </div>
                
                <div className="comparison-arrow">
                  <div className="arrow-line"></div>
                  <span>Solar Impact</span>
                </div>
                
                <div className="comparison-item after">
                  <div className="comparison-label">Future Bill</div>
                  <div className="comparison-amount">${Math.round(annualCost / 12) - monthlySavings}</div>
                  <div className="comparison-period">per month</div>
                </div>
              </div>
              
              <div className="savings-summary">
                <div className="savings-badge">
                  Save ${monthlySavings}/month • ${Math.round(solarSavings)}/year
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="analysis-card environmental-card">
              <div className="card-header-enhanced">
                <div className="card-icon-enhanced">
                  <LeafIcon size={24} />
                </div>
                <div className="card-title-enhanced">
                  <h3>Environmental Impact</h3>
                  <p>Your contribution to sustainability</p>
                </div>
              </div>
              
              <div className="environmental-metrics">
                <div className="metric-item">
                  <div className="metric-number">{co2Reduction}kg</div>
                  <div className="metric-label">CO₂ Reduced Annually</div>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-item">
                  <div className="metric-number">{treesEquivalent}</div>
                  <div className="metric-label">Tree Equivalents</div>
                </div>
              </div>
              
              <div className="environmental-visual">
                <div className="trees-visual">
                  {Array.from({length: Math.min(treesEquivalent, 8)}).map((_, i) => (
                    <LeafIcon key={i} size={20} className="tree-icon" />
                  ))}
                  {treesEquivalent > 8 && <span className="tree-count">+{treesEquivalent - 8}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Design Section */}
        <div className="system-section-enhanced">
          <div className="section-header-enhanced">
            <h2>Your Solar System Design</h2>
            <p>Premium components designed for your specific needs</p>
          </div>

          <div className="system-content-enhanced">
            <div className="system-overview">
              <div className="system-main-card">
                <div className="system-visual">
                  <div className="system-icon-large">
                    <SunIcon size={48} />
                  </div>
                  <div className="system-details">
                    <h3>{systemSize}kW Solar System</h3>
                    <p className="system-description">
                      High-efficiency monocrystalline panels with premium inverter technology
                    </p>
                    <div className="system-warranty">
                      <span className="warranty-badge">25-Year Warranty</span>
                      <span className="quality-badge">Tier 1 Panels</span>
                    </div>
                  </div>
                </div>
                
                <div className="system-features">
                  <div className="feature-row">
                    <span className="feature-check">✓</span>
                    <span>Premium monocrystalline solar panels</span>
                  </div>
                  <div className="feature-row">
                    <span className="feature-check">✓</span>
                    <span>Advanced string inverter technology</span>
                  </div>
                  <div className="feature-row">
                    <span className="feature-check">✓</span>
                    <span>Real-time monitoring system</span>
                  </div>
                  <div className="feature-row">
                    <span className="feature-check">✓</span>
                    <span>Weather-resistant design</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="system-specs">
              <div className="spec-card-enhanced">
                <h4>Roof Analysis</h4>
                <div className="spec-details">
                  <div className="spec-item">
                    <span className="spec-label">Total Roof Area</span>
                    <span className="spec-value">{roofArea}m²</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Usable Area</span>
                    <span className="spec-value">{Math.round(roofArea * 0.85)}m²</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Panel Count</span>
                    <span className="spec-value">~{Math.round(systemSize * 2.5)} panels</span>
                  </div>
                </div>
              </div>

              <div className="spec-card-enhanced">
                <h4>Investment Return</h4>
                <div className="return-visual">
                  <div className="payback-period">
                    <span className="payback-years">6-8</span>
                    <span className="payback-label">years payback</span>
                  </div>
                  <div className="lifetime-savings">
                    <span className="lifetime-amount">${Math.round(solarSavings * 25).toLocaleString()}</span>
                    <span className="lifetime-label">25-year savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-section-enhanced">
          <div className="section-header-enhanced">
            <h2>Installation Details</h2>
            <p>Everything we need to move forward with your solar installation</p>
          </div>

          <div className="customer-cards-enhanced">
            <div className="info-card-enhanced">
              <div className="info-header">
                <HomeIcon size={20} />
                <h3>Property Information</h3>
              </div>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">Customer</span>
                  <span className="info-value">{formData.customerName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Property Type</span>
                  <span className="info-value">{userInfo?.userType?.charAt(0).toUpperCase() + userInfo?.userType?.slice(1) || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Installation Address</span>
                  <span className="info-value">{formData.supplyAddress || formData.billingAddress}</span>
                </div>
              </div>
            </div>

            <div className="info-card-enhanced">
              <div className="info-header">
                <LightningIcon size={20} />
                <h3>Contact Information</h3>
              </div>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">Contact Name</span>
                  <span className="info-value">{userInfo?.contactName || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{userInfo?.contactEmail || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{userInfo?.contactPhone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps CTA */}
        <div className="next-steps-enhanced">
          <div className="steps-container">
            <div className="steps-header">
              <h2>Ready to Start Your Solar Journey?</h2>
              <p>Here's exactly what happens next:</p>
            </div>
            
            <div className="steps-timeline">
              <div className="timeline-step">
                <div className="step-indicator">
                  <span className="step-number">1</span>
                </div>
                <div className="step-content">
                  <h4>Free Site Assessment</h4>
                  <p>Professional evaluation of your roof and energy needs</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-indicator">
                  <span className="step-number">2</span>
                </div>
                <div className="step-content">
                  <h4>System Design & Approvals</h4>
                  <p>Custom engineering and permit applications</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-indicator">
                  <span className="step-number">3</span>
                </div>
                <div className="step-content">
                  <h4>Rebate Processing</h4>
                  <p>We handle all government incentive paperwork</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-indicator">
                  <span className="step-number">4</span>
                </div>
                <div className="step-content">
                  <h4>Professional Installation</h4>
                  <p>Certified technicians complete your system</p>
                </div>
              </div>
            </div>
            
            <div className="timeline-summary">
              <p><strong>Timeline:</strong> Complete installation typically takes 4-6 weeks from approval</p>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="proposal-actions-enhanced">
          <div className="actions-wrapper">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn btn-primary btn-lg"
            >
              {isDownloading ? <LoadingSpinner size={20} /> : <DownloadIcon size={20} />}
              <span>{isDownloading ? 'Generating...' : 'Download Proposal'}</span>
            </button>
            
            <button 
              onClick={handleSendEmail}
              disabled={isEmailing}
              className="btn btn-secondary btn-lg"
            >
              {isEmailing ? <LoadingSpinner size={20} /> : <SaveIcon size={20} />}
              <span>{isEmailing ? 'Sending...' : 'Email Proposal'}</span>
            </button>
            
            <button onClick={onReset} className="btn btn-ghost">
              <RefreshIcon size={20} />
              <span>Start New Analysis</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="proposal-footer-enhanced">
          <div className="footer-content">
            <div className="footer-brand">
              <SunIcon size={24} />
              <span>BEDA Solar</span>
            </div>
            <p>Clean Energy Solutions • Powering Australia's Future</p>
            <div className="footer-date">
              Proposal generated on {getCurrentDate()}
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