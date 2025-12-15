// Input validation utilities for different formats

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: Record<string, any>;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
};

/**
 * Validates URL format
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    return { 
      valid: true, 
      details: {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname
      }
    };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validates IPv4 address format
 */
export const validateIPv4 = (ip: string): ValidationResult => {
  if (!ip || ip.trim().length === 0) {
    return { valid: false, error: 'IP address is required' };
  }

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!ipv4Regex.test(ip)) {
    return { valid: false, error: 'Invalid IPv4 address format' };
  }

  return { valid: true };
};

/**
 * Validates IPv6 address format
 */
export const validateIPv6 = (ip: string): ValidationResult => {
  if (!ip || ip.trim().length === 0) {
    return { valid: false, error: 'IPv6 address is required' };
  }

  // Simplified IPv6 validation - covers most common cases
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  const ipv6CompressedRegex = /^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^::$/;
  
  if (!ipv6Regex.test(ip) && !ipv6CompressedRegex.test(ip)) {
    return { valid: false, error: 'Invalid IPv6 address format' };
  }

  return { valid: true };
};

/**
 * Validates credit card number using Luhn algorithm
 */
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  if (!cardNumber || cardNumber.trim().length === 0) {
    return { valid: false, error: 'Credit card number is required' };
  }

  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if all characters are digits
  if (!/^\d+$/.test(cleanNumber)) {
    return { valid: false, error: 'Credit card number must contain only digits' };
  }

  // Check length (most cards are 13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { valid: false, error: 'Credit card number must be 13-19 digits long' };
  }

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;
  
  if (!isValid) {
    return { valid: false, error: 'Invalid credit card number (failed Luhn check)' };
  }

  // Determine card type
  let cardType = 'Unknown';
  if (/^4/.test(cleanNumber)) cardType = 'Visa';
  else if (/^5[1-5]/.test(cleanNumber)) cardType = 'MasterCard';
  else if (/^3[47]/.test(cleanNumber)) cardType = 'American Express';
  else if (/^6(?:011|5)/.test(cleanNumber)) cardType = 'Discover';

  return { 
    valid: true, 
    details: { 
      cardType,
      lastFour: cleanNumber.slice(-4)
    }
  };
};

/**
 * Validates phone number format (US format)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // US phone numbers should be 10 digits (or 11 with country code)
  if (cleanPhone.length === 10) {
    return { 
      valid: true, 
      details: { 
        formatted: `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}` 
      }
    };
  } else if (cleanPhone.length === 11 && cleanPhone[0] === '1') {
    const phoneWithoutCountry = cleanPhone.slice(1);
    return { 
      valid: true, 
      details: { 
        formatted: `+1 (${phoneWithoutCountry.slice(0, 3)}) ${phoneWithoutCountry.slice(3, 6)}-${phoneWithoutCountry.slice(6)}` 
      }
    };
  }

  return { valid: false, error: 'Phone number must be 10 digits (or 11 with country code)' };
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const issues: string[] = [];
  
  if (password.length < minLength) {
    issues.push(`Must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    issues.push('Must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    issues.push('Must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    issues.push('Must contain at least one number');
  }
  if (!hasSpecialChar) {
    issues.push('Must contain at least one special character');
  }

  if (issues.length > 0) {
    return { valid: false, error: issues.join(', ') };
  }

  // Calculate strength score
  let strength = 0;
  if (password.length >= 12) strength += 2;
  else if (password.length >= 8) strength += 1;
  
  if (hasUpperCase) strength += 1;
  if (hasLowerCase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSpecialChar) strength += 1;

  const strengthLevel = strength >= 5 ? 'Strong' : strength >= 3 ? 'Medium' : 'Weak';

  return { 
    valid: true, 
    details: { 
      strength: strengthLevel,
      score: strength
    }
  };
};