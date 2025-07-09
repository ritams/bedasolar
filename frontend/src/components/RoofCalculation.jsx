import { useState, useEffect } from 'react'
import { HomeIcon, LoadingSpinner } from '../assets/icons'

export default function RoofCalculation({ userInfo, address, onConfirm, onBack }) {
  const [isCalculating, setIsCalculating] = useState(true)
  const [roofArea, setRoofArea] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate roof calculation
    const timer = setTimeout(() => {
      const calculatedArea = Math.floor(Math.random() * 100) + 80 // 80-180m²
      setRoofArea(calculatedArea)
      setIsCalculating(false)
      setMapLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleConfirm = () => {
    onConfirm({ roofArea })
  }

  return (
    <div>
      <div className="step-header">
        <h1 className="step-title">
          <HomeIcon size={24} />
          Roof Area Analysis
        </h1>
        <p className="step-subtitle">
          We're analyzing your property's roof area using satellite imagery to design your optimal solar system.
        </p>
      </div>

      <div className="modern-form">
        {/* Property Address Section */}
        <div className="form-floating-section">
          <h2 className="section-title">
            <HomeIcon size={20} />
            Property Address
          </h2>
          <div className="address-box">{address}</div>
        </div>

        {/* Satellite Analysis Section */}
        <div className="form-floating-section">
          <h2 className="section-title">
            Satellite Analysis
          </h2>
          
          <div className="map-container">
            {isCalculating ? (
              <div className="calculating-state">
                <LoadingSpinner size={48} />
                <h3>Analyzing Roof Area...</h3>
                <p>Processing satellite imagery and calculating optimal solar panel placement</p>
                <div className="progress-steps">
                  <div className="step active">Satellite Data</div>
                  <div className="step active">Roof Detection</div>
                  <div className="step">Area Calculation</div>
                </div>
              </div>
            ) : (
              <div className="map-result">
                <div className="map-placeholder">
                  <div className="roof-outline">
                    <div className="roof-area">
                      {roofArea}m²
                    </div>
                  </div>
                  <p className="map-caption">Satellite view with roof area highlighted</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculation Results Section */}
        {!isCalculating && (
          <div className="form-floating-section">
            <h2 className="section-title">
              Calculation Results
            </h2>
            
            <div className="form-grid-3">
              <div className="result-card">
                <strong className="result-label">Total Roof Area:</strong>
                <span className="result-value">{roofArea}m²</span>
              </div>
              <div className="result-card">
                <strong className="result-label">Usable Area (85%):</strong>
                <span className="result-value">{Math.floor(roofArea * 0.85)}m²</span>
              </div>
              <div className="result-card">
                <strong className="result-label">Est. Panel Capacity:</strong>
                <span className="result-value">{Math.floor(roofArea * 0.85 / 2)}kW</span>
              </div>
            </div>
          </div>
        )}

        {/* Adjustment Section */}
        {!isCalculating && (
          <div className="form-floating-section">
            <h3 className="section-title">Adjust Roof Area</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="roof-area-input">
                Roof Area (m²)
              </label>
              <input 
                id="roof-area-input"
                type="number" 
                className="form-input"
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
                min="20"
                max="500"
                aria-describedby="roof-area-help"
              />
              <p id="roof-area-help" className="upload-note">
                You can adjust this value if you have more accurate measurements
              </p>
            </div>
          </div>
        )}

        <div className="form-actions-floating">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleConfirm}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Confirm & Continue'}
          </button>
        </div>
      </div>
    </div>
  )
} 