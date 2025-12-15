// Base64 encoder/decoder utilities with round-trip validation

export interface EncodeResult {
  success: boolean;
  encoded?: string;
  error?: string;
}

export interface DecodeResult {
  success: boolean;
  decoded?: string;
  error?: string;
}

/**
 * Encodes a string to Base64
 */
export const encodeBase64 = (input: string): EncodeResult => {
  if (typeof input !== 'string') {
    return { success: false, error: 'Input must be a string' };
  }

  try {
    // Handle both browser and Node.js environments
    let encoded: string;
    
    if (typeof window !== 'undefined') {
      // Browser environment
      encoded = btoa(unescape(encodeURIComponent(input)));
    } else {
      // Node.js environment
      encoded = Buffer.from(input, 'utf8').toString('base64');
    }
    
    return { success: true, encoded };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to encode to Base64';
    return { success: false, error: errorMessage };
  }
};

/**
 * Decodes a Base64 string
 */
export const decodeBase64 = (input: string): DecodeResult => {
  if (typeof input !== 'string') {
    return { success: false, error: 'Input must be a string' };
  }

  if (input.trim().length === 0) {
    return { success: false, error: 'Input is empty' };
  }

  // Validate Base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(input.replace(/\s/g, ''))) {
    return { success: false, error: 'Invalid Base64 format' };
  }

  try {
    let decoded: string;
    
    if (typeof window !== 'undefined') {
      // Browser environment
      decoded = decodeURIComponent(escape(atob(input)));
    } else {
      // Node.js environment
      decoded = Buffer.from(input, 'base64').toString('utf8');
    }
    
    return { success: true, decoded };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to decode from Base64';
    return { success: false, error: errorMessage };
  }
};

/**
 * Validates round-trip encoding/decoding integrity
 */
export const validateBase64RoundTrip = (original: string): boolean => {
  const encoded = encodeBase64(original);
  if (!encoded.success || !encoded.encoded) {
    return false;
  }

  const decoded = decodeBase64(encoded.encoded);
  if (!decoded.success || !decoded.decoded) {
    return false;
  }

  return decoded.decoded === original;
};