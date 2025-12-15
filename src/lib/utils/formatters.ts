// JSON formatter utilities with validation and error handling

export interface JsonFormatResult {
  success: boolean;
  formatted?: string;
  error?: string;
}

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates if a string is valid JSON
 */
export const validateJson = (input: string): JsonValidationResult => {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'Input is empty' };
  }

  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
    return { valid: false, error: errorMessage };
  }
};

/**
 * Formats JSON string with proper indentation
 */
export const formatJson = (input: string, indent: number = 2): JsonFormatResult => {
  const validation = validateJson(input);
  
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    return { success: true, formatted };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to format JSON';
    return { success: false, error: errorMessage };
  }
};

/**
 * Minifies JSON by removing all unnecessary whitespace
 */
export const minifyJson = (input: string): JsonFormatResult => {
  const validation = validateJson(input);
  
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { success: true, formatted: minified };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to minify JSON';
    return { success: false, error: errorMessage };
  }
};