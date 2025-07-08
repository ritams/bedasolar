export default function ProgressBar({ currentStep, steps }) {
  const stepIndex = steps.indexOf(currentStep)
  const progressPercentage = ((stepIndex + 1) / steps.length) * 100

  const stepLabels = {
    upload: 'Upload',
    billForm: 'Verify', 
    userInfo: 'Details',
    roofCalculation: 'Analysis',
    proposal: 'Proposal'
  }

  return (
    <div className="progress-bar-minimal">
      <div className="progress-track-minimal">
        <div 
          className="progress-fill-minimal"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="progress-info">
        <div className="progress-steps-minimal">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`step-minimal ${index <= stepIndex ? 'completed' : ''} ${index === stepIndex ? 'current' : ''}`}
              title={stepLabels[step]}
            >
              <div className="step-dot-minimal"></div>
              <span className="step-label-minimal">{stepLabels[step]}</span>
            </div>
          ))}
        </div>
        
        <div className="progress-counter-minimal">
          {stepIndex + 1} / {steps.length}
        </div>
      </div>
    </div>
  )
} 