/**
 * Reusable FormField Component with validation and accessibility
 */
import React from 'react';
import { escapeHtml } from '../../utils/sanitize.js';

/**
 * FormField - Reusable form field with validation and accessibility
 * @param {Object} props - Component properties
 */
export const FormField = React.memo(({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  helpText,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const fieldId = id || name;
  const hasError = Boolean(error);
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(name, newValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(name);
    }
  };

  // Input component selection
  const InputComponent = type === 'textarea' ? 'textarea' : 
                        type === 'select' ? 'select' : 'input';

  const inputProps = {
    id: fieldId,
    name,
    value: value || '',
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder,
    required,
    disabled,
    'aria-invalid': hasError,
    'aria-describedby': [helpTextId, errorId].filter(Boolean).join(' ') || undefined,
    className: `form-input ${hasError ? 'error' : ''} ${className}`.trim(),
    ...props
  };

  if (type !== 'textarea' && type !== 'select') {
    inputProps.type = type;
  }

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="text-error" aria-label="required">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select {...inputProps}>
          {children}
        </select>
      ) : (
        <InputComponent {...inputProps} />
      )}
      
      {helpText && (
        <p id={helpTextId} className="form-help-text">
          {helpText}
        </p>
      )}
      
      {hasError && (
        <p id={errorId} className="form-error-text" role="alert">
          {escapeHtml(error)}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

/**
 * CheckboxField - Specialized checkbox field component
 */
export const CheckboxField = React.memo(({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const fieldId = id || name;
  const hasError = Boolean(error);

  const handleChange = (e) => {
    onChange(name, e.target.checked);
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      <label className="form-checkbox">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          checked={checked || false}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={hasError}
          {...props}
        />
        <span className="checkbox-mark" />
        <span className="checkbox-text">
          {label}
        </span>
      </label>
      
      {hasError && (
        <p className="form-error-text" role="alert">
          {escapeHtml(error)}
        </p>
      )}
    </div>
  );
});

CheckboxField.displayName = 'CheckboxField'; 