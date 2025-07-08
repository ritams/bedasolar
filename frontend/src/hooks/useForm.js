/**
 * Custom hook for form management with validation
 * @param {Object} initialValues - initial form values
 * @param {Function} validationSchema - validation function
 * @returns {Object} - form state and methods
 */
import { useState, useCallback, useMemo } from 'react';

export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field changes
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field on blur
    if (validationSchema && touched[name]) {
      const fieldErrors = validationSchema({ [name]: values[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] || '' }));
    }
  }, [validationSchema, values, touched]);

  // Validate all fields
  const validate = useCallback(() => {
    if (!validationSchema) return {};
    return validationSchema(values);
  }, [validationSchema, values]);

  // Check if form is valid
  const isValid = useMemo(() => {
    const currentErrors = validate();
    return Object.keys(currentErrors).length === 0;
  }, [validate]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    const formErrors = validate();
    setErrors(formErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, values]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors
  };
}; 