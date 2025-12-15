// Color conversion utilities with accuracy preservation

export interface ColorConversionResult {
  success: boolean;
  color?: string;
  error?: string;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Validates if a string is a valid HEX color
 */
export const isValidHex = (hex: string): boolean => {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
};

/**
 * Validates if RGB values are within valid range (0-255)
 */
export const isValidRgb = (r: number, g: number, b: number): boolean => {
  return [r, g, b].every(value => 
    Number.isInteger(value) && value >= 0 && value <= 255
  );
};

/**
 * Validates if HSL values are within valid ranges
 */
export const isValidHsl = (h: number, s: number, l: number): boolean => {
  return Number.isFinite(h) && h >= 0 && h <= 360 &&
         Number.isFinite(s) && s >= 0 && s <= 100 &&
         Number.isFinite(l) && l >= 0 && l <= 100;
};

/**
 * Converts HEX color to RGB
 */
export const hexToRgb = (hex: string): ColorConversionResult => {
  if (!isValidHex(hex)) {
    return { success: false, error: 'Invalid HEX color format' };
  }

  // Remove # if present and handle 3-digit hex
  const cleanHex = hex.replace('#', '');
  const fullHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

  try {
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    if (!isValidRgb(r, g, b)) {
      return { success: false, error: 'Invalid RGB values calculated from HEX' };
    }

    return { success: true, color: `rgb(${r}, ${g}, ${b})` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert HEX to RGB';
    return { success: false, error: errorMessage };
  }
};

/**
 * Converts RGB to HEX
 */
export const rgbToHex = (r: number, g: number, b: number): ColorConversionResult => {
  if (!isValidRgb(r, g, b)) {
    return { success: false, error: 'Invalid RGB values' };
  }

  try {
    const toHex = (value: number): string => {
      const hex = Math.round(value).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return { success: true, color: hex.toLowerCase() };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert RGB to HEX';
    return { success: false, error: errorMessage };
  }
};

/**
 * Converts RGB to HSL
 */
export const rgbToHsl = (r: number, g: number, b: number): ColorConversionResult => {
  if (!isValidRgb(r, g, b)) {
    return { success: false, error: 'Invalid RGB values' };
  }

  try {
    // Normalize RGB values to 0-1 range
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    // Calculate lightness
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
      // Calculate saturation
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      // Calculate hue
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / diff + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / diff + 4;
          break;
      }
      h /= 6;
    }

    // Convert to standard HSL format
    const hDeg = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    return { success: true, color: `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert RGB to HSL';
    return { success: false, error: errorMessage };
  }
};

/**
 * Converts HSL to RGB
 */
export const hslToRgb = (h: number, s: number, l: number): ColorConversionResult => {
  if (!isValidHsl(h, s, l)) {
    return { success: false, error: 'Invalid HSL values' };
  }

  try {
    // Normalize values
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (sNorm === 0) {
      // Achromatic (gray)
      r = g = b = lNorm;
    } else {
      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
      const p = 2 * lNorm - q;
      
      r = hue2rgb(p, q, hNorm + 1/3);
      g = hue2rgb(p, q, hNorm);
      b = hue2rgb(p, q, hNorm - 1/3);
    }

    // Convert to 0-255 range
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);

    return { success: true, color: `rgb(${rInt}, ${gInt}, ${bInt})` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert HSL to RGB';
    return { success: false, error: errorMessage };
  }
};

/**
 * Parses RGB string to RGB values
 */
export const parseRgb = (rgbString: string): RgbColor | null => {
  const rgbMatch = rgbString.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!rgbMatch) return null;

  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);

  return isValidRgb(r, g, b) ? { r, g, b } : null;
};

/**
 * Parses HSL string to HSL values
 */
export const parseHsl = (hslString: string): HslColor | null => {
  const hslMatch = hslString.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (!hslMatch) return null;

  const h = parseInt(hslMatch[1], 10);
  const s = parseInt(hslMatch[2], 10);
  const l = parseInt(hslMatch[3], 10);

  return isValidHsl(h, s, l) ? { h, s, l } : null;
};