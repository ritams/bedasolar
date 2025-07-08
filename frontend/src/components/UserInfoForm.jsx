/**
 * UserInfoForm Component - Collects user information with validation
 * Uses modern form management and validation patterns
 */
import React, { useCallback } from 'react';
import { submitUserInfo } from '../utils/api.js';
import { sanitizeFormData, isValidEmail, isValidPhone } from '../utils/sanitize.js';
import { useForm } from '../hooks/useForm.js';
import { useMessage } from '../hooks/useMessage.js';
import { FormField, CheckboxField } from './ui/FormField.jsx';
import { SaveIcon, RefreshIcon, LoadingSpinner, HomeIcon } from '../assets/icons/index.js';

/**
 * Form validation schema
 */
const validateUserInfo = (values) => {
  const errors = {};

  // Required fields
  if (!values.userType?.trim()) {
    errors.userType = 'Please select your role';
  }
  if (!values.contactName?.trim()) {
    errors.contactName = 'Full name is required';
  }
  if (!values.contactEmail?.trim()) {
    errors.contactEmail = 'Email is required';
  } else if (!isValidEmail(values.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }
  if (!values.contactPhone?.trim()) {
    errors.contactPhone = 'Phone number is required';
  } else if (!isValidPhone(values.contactPhone)) {
    errors.contactPhone = 'Please enter a valid Australian phone number';
  }

  // Tenant-specific validation
  if (values.userType === 'tenant') {
    if (!values.landlordName?.trim()) {
      errors.landlordName = 'Landlord name is required';
    }
    if (!values.landlordEmail?.trim()) {
      errors.landlordEmail = 'Landlord email is required';
    } else if (!isValidEmail(values.landlordEmail)) {
      errors.landlordEmail = 'Please enter a valid email address';
    }
  }

  return errors;
};

/**
 * UserType section component
 */
const UserTypeSection = React.memo(({ values, handleChange, handleBlur, errors }) => (
  <div className="form-floating-section">
    <h3 className="section-title flex-start gap-fluid-sm">
      <HomeIcon size={20} />
      Property & Contact Information
    </h3>
    
    <div className="grid-fluid-3">
      <FormField
        name="userType"
        type="select"
        label="I am a"
        value={values.userType}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.userType}
      >
        <option value="">Select your role</option>
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
        <option value="smb">Small/Medium Business</option>
      </FormField>

      <FormField
        name="contactName"
        label="Full Name"
        value={values.contactName}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Your full name"
        required
        error={errors.contactName}
      />

      <FormField
        name="contactEmail"
        type="email"
        label="Email"
        value={values.contactEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="your@email.com"
        required
        error={errors.contactEmail}
      />
    </div>

    <FormField
      name="contactPhone"
      type="tel"
      label="Phone Number"
      value={values.contactPhone}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="04XX XXX XXX"
      required
      error={errors.contactPhone}
      helpText="Australian mobile or landline number"
    />
  </div>
));

UserTypeSection.displayName = 'UserTypeSection';

/**
 * Landlord section component
 */
const LandlordSection = React.memo(({ values, handleChange, handleBlur, errors }) => (
  <div className="form-floating-section">
    <h3 className="section-title">
      Landlord Contact Information
    </h3>
    <div className="grid-fluid-2">
      <FormField
        name="landlordName"
        label="Landlord Name"
        value={values.landlordName}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Landlord full name"
        required
        error={errors.landlordName}
      />
      <FormField
        name="landlordEmail"
        type="email"
        label="Landlord Email"
        value={values.landlordEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="landlord@email.com"
        required
        error={errors.landlordEmail}
      />
    </div>
    <FormField
      name="landlordPhone"
      type="tel"
      label="Landlord Phone"
      value={values.landlordPhone}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="04XX XXX XXX"
      error={errors.landlordPhone}
      helpText="Optional - can be helpful for coordination"
    />
  </div>
));

LandlordSection.displayName = 'LandlordSection';

/**
 * Business section component
 */
const BusinessSection = React.memo(({ values, handleChange, errors }) => (
  <div className="form-floating-section">
    <h3 className="section-title">
      Business Considerations
    </h3>
    <CheckboxField
      name="futureConsumption"
      label="Planning to increase energy consumption (expansion, new equipment, etc.)"
      checked={values.futureConsumption}
      onChange={handleChange}
      error={errors.futureConsumption}
    />
  </div>
));

BusinessSection.displayName = 'BusinessSection';

/**
 * Main UserInfoForm component
 */
export default function UserInfoForm({ billData, onSubmit, onBack }) {
  const { message, showMessage } = useMessage();

  // Initialize form with validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    {
      userType: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      landlordName: '',
      landlordEmail: '',
      landlordPhone: '',
      futureConsumption: false
    },
    validateUserInfo
  );

  /**
   * Handle form submission
   */
  const onFormSubmit = useCallback(async (formData) => {
    try {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData);
      const userData = await submitUserInfo({ ...sanitizedData, billData });
      
      showMessage('User information saved successfully!', 'success');
      onSubmit(userData);
    } catch (error) {
      console.error('User info submission error:', error);
      showMessage(`Save failed: ${error.message || 'Unknown error occurred'}`, 'error');
    }
  }, [billData, onSubmit, showMessage]);

  /**
   * Handle form submission with validation
   */
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    handleSubmit(onFormSubmit);
  }, [handleSubmit, onFormSubmit]);

  return (
    <div className="userinfo-section">
      <div className="step-header">
        <h1 className="step-title text-fluid-2xl">Installation Details</h1>
        <p className="step-subtitle text-fluid-base">
          Let's get your contact information and property details to personalize your solar proposal.
        </p>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="modern-form space-fluid-md">
        <UserTypeSection
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
        />

        {values.userType === 'tenant' && (
          <LandlordSection
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
          />
        )}

        {values.userType === 'smb' && (
          <BusinessSection
            values={values}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        <div className="form-actions-floating flex-between gap-fluid-sm">
          <button 
            type="button" 
            onClick={onBack} 
            className="btn btn-secondary transition-smooth"
            disabled={isSubmitting}
          >
            <RefreshIcon size={20} />
            <span>Back to Bill Data</span>
          </button>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !isValid} 
            className="btn btn-primary transition-smooth"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size={20} />
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
  );
} 