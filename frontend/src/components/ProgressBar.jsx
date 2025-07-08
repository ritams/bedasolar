/**
 * ProgressBar Component - Displays current step progress with responsive design
 * Uses modern React patterns and responsive utilities
 */
import React, { useMemo } from 'react';

/**
 * Step configuration with labels
 */
const STEP_CONFIG = {
  upload: 'Upload',
  billForm: 'Verify', 
  userInfo: 'Details',
  roofCalculation: 'Analysis',
  proposal: 'Proposal'
};

/**
 * Individual step indicator component
 */
const StepIndicator = React.memo(({ step, index, isCompleted, isCurrent, label }) => {
  const stepClasses = [
    'step-minimal',
    isCompleted && 'completed',
    isCurrent && 'current'
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={stepClasses}
      title={label}
      aria-label={`Step ${index + 1}: ${label} ${isCurrent ? '(current)' : isCompleted ? '(completed)' : '(pending)'}`}
    >
      <div className="step-dot-minimal" />
      <span className="step-label-minimal">{label}</span>
    </div>
  );
});

StepIndicator.displayName = 'StepIndicator';

/**
 * Main ProgressBar component
 */
export default function ProgressBar({ currentStep, steps }) {
  // Memoized calculations for performance
  const { stepIndex, progressPercentage, stepData } = useMemo(() => {
    const index = steps.indexOf(currentStep);
    const percentage = ((index + 1) / steps.length) * 100;
    const data = steps.map((step, idx) => ({
      step,
      index: idx,
      label: STEP_CONFIG[step] || step,
      isCompleted: idx < index,
      isCurrent: idx === index
    }));

    return {
      stepIndex: index,
      progressPercentage: percentage,
      stepData: data
    };
  }, [currentStep, steps]);

  return (
    <div className="progress-bar-minimal container-md">
      {/* Progress track with fluid fill */}
      <div className="progress-track-minimal">
        <div 
          className="progress-fill-minimal transition-smooth"
          style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Progress: Step ${stepIndex + 1} of ${steps.length}`}
        />
      </div>
      
      {/* Step indicators and counter */}
      <div className="progress-info flex-between gap-fluid-sm">
        <div className="progress-steps-minimal flex-start gap-fluid-md">
          {stepData.map((stepInfo) => (
            <StepIndicator
              key={stepInfo.step}
              {...stepInfo}
            />
          ))}
        </div>
        
        <div className="progress-counter-minimal text-fluid-sm">
          {stepIndex + 1} / {steps.length}
        </div>
      </div>
    </div>
  );
} 