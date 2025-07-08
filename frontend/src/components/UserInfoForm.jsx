import { useState } from 'react'
import { submitUserInfo } from '../utils/api.js'
import { useMessage } from '../hooks/useMessage.js'
import { SaveIcon, RefreshIcon, LoadingSpinner, HomeIcon } from '../assets/icons/index.js'

export default function UserInfoForm({ billData, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    userType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    futureConsumption: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const { message, showMessage } = useMessage()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const userData = await submitUserInfo({ ...formData, billData })
      showMessage('User information saved successfully!', 'success')
      onSubmit(userData)
    } catch (error) {
      showMessage('Save failed: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="userinfo-section">
      <div className="step-header">
        <h1 className="step-title">Installation Details</h1>
        <p className="step-subtitle">
          Let's get your contact information and property details to personalize your solar proposal.
        </p>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-floating-section">
          <h3 className="section-title">
            <HomeIcon size={20} />
            Property & Contact Information
          </h3>
          
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">I am a *</label>
              <select 
                className="form-input modern-select"
                value={formData.userType}
                onChange={(e) => handleChange('userType', e.target.value)}
                required
              >
                <option value="">Select your role</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="smb">Small/Medium Business</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text"
                className="form-input"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input 
                type="email"
                className="form-input"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input 
              type="tel"
              className="form-input"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              required
              placeholder="04XX XXX XXX"
            />
          </div>
        </div>

        {formData.userType === 'tenant' && (
          <div className="form-floating-section">
            <h3 className="section-title">
              Landlord Contact Information
            </h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Landlord Name *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={formData.landlordName}
                  onChange={(e) => handleChange('landlordName', e.target.value)}
                  required
                  placeholder="Landlord full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Landlord Email *</label>
                <input 
                  type="email"
                  className="form-input"
                  value={formData.landlordEmail}
                  onChange={(e) => handleChange('landlordEmail', e.target.value)}
                  required
                  placeholder="landlord@email.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Landlord Phone</label>
              <input 
                type="tel"
                className="form-input"
                value={formData.landlordPhone}
                onChange={(e) => handleChange('landlordPhone', e.target.value)}
                placeholder="04XX XXX XXX"
              />
            </div>
          </div>
        )}

        {formData.userType === 'smb' && (
          <div className="form-floating-section">
            <h3 className="section-title">
              Business Considerations
            </h3>
            <div className="form-group">
              <label className="form-checkbox">
                <input 
                  type="checkbox"
                  checked={formData.futureConsumption}
                  onChange={(e) => handleChange('futureConsumption', e.target.checked)}
                />
                <span className="checkbox-mark"></span>
                <span className="checkbox-text">Planning to increase energy consumption (expansion, new equipment, etc.)</span>
              </label>
            </div>
          </div>
        )}

        <div className="form-actions-floating">
          <button type="button" onClick={onBack} className="btn btn-secondary">
            <RefreshIcon size={20} />
            <span>Back to Bill Data</span>
          </button>
          
          <button type="submit" disabled={isSaving} className="btn btn-primary">
            {isSaving ? (
              <>
                <LoadingSpinner />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SaveIcon size={20} />
                <span>Continue to Roof Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 