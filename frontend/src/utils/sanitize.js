/**
 * Input sanitization utilities for XSS protection
 */

/**
 * Sanitizes a string by removing potentially dangerous HTML/script content
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous HTML attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*javascript:\s*/gi, '');
  
  // Remove potentially dangerous tags
  const dangerousTags = ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized.trim();
};

/**
 * Escapes HTML entities to prevent XSS
 * @param {string} unsafe - Unsafe string
 * @returns {string} - HTML escaped string
 */
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (Australian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+61|0)[2-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitizes form data object
 * @param {Object} data - Form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitized[key] = isNaN(value) ? 0 : value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = Boolean(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Validates file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['application/pdf'],
    allowedExtensions = ['.pdf']
  } = options;

  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 