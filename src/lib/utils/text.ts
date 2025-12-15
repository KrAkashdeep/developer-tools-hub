// Text utilities for manipulation and analysis

export interface TextProcessingResult {
  success: boolean;
  result?: string;
  error?: string;
}

export interface TextAnalysisResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
}

/**
 * Counts words in text using various counting methods
 */
export const countWords = (text: string): number => {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Counts characters in text
 */
export const countCharacters = (text: string, includeSpaces: boolean = true): number => {
  if (!text) return 0;
  
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
};

/**
 * Counts sentences in text
 */
export const countSentences = (text: string): number => {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Split by sentence-ending punctuation, filter empty strings
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  return sentences.length;
};

/**
 * Counts paragraphs in text
 */
export const countParagraphs = (text: string): number => {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Split by double line breaks, filter empty strings
  const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
  return paragraphs.length;
};

/**
 * Counts lines in text
 */
export const countLines = (text: string): number => {
  if (!text) return 0;
  
  // Split by line breaks and count non-empty lines
  const lines = text.split(/\n/).filter(line => line.trim().length > 0);
  return lines.length;
};

/**
 * Provides comprehensive text analysis
 */
export const analyzeText = (text: string): TextAnalysisResult => {
  return {
    characters: countCharacters(text, true),
    charactersNoSpaces: countCharacters(text, false),
    words: countWords(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text)
  };
};

/**
 * Removes duplicate lines from text while preserving order
 */
export const removeDuplicateLines = (text: string): TextProcessingResult => {
  if (!text) {
    return { success: true, result: '' };
  }

  try {
    const lines = text.split('\n');
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        uniqueLines.push(line);
      }
    }

    return { success: true, result: uniqueLines.join('\n') };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove duplicate lines';
    return { success: false, error: errorMessage };
  }
};

/**
 * Removes duplicate words from text while preserving order
 */
export const removeDuplicateWords = (text: string): TextProcessingResult => {
  if (!text) {
    return { success: true, result: '' };
  }

  try {
    const words = text.split(/\s+/);
    const seen = new Set<string>();
    const uniqueWords: string[] = [];

    for (const word of words) {
      if (word.length > 0 && !seen.has(word.toLowerCase())) {
        seen.add(word.toLowerCase());
        uniqueWords.push(word);
      }
    }

    return { success: true, result: uniqueWords.join(' ') };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove duplicate words';
    return { success: false, error: errorMessage };
  }
};

/**
 * Generates URL-friendly slug from text
 */
export const generateSlug = (text: string): TextProcessingResult => {
  if (!text || text.trim().length === 0) {
    return { success: false, error: 'Input text is empty' };
  }

  try {
    const slug = text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');

    if (slug.length === 0) {
      return { success: false, error: 'No valid characters found for slug generation' };
    }

    return { success: true, result: slug };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate slug';
    return { success: false, error: errorMessage };
  }
};

/**
 * Converts text to title case
 */
export const toTitleCase = (text: string): TextProcessingResult => {
  if (!text) {
    return { success: true, result: '' };
  }

  try {
    const titleCase = text
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');

    return { success: true, result: titleCase };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert to title case';
    return { success: false, error: errorMessage };
  }
};

/**
 * Converts text to camelCase
 */
export const toCamelCase = (text: string): TextProcessingResult => {
  if (!text) {
    return { success: true, result: '' };
  }

  try {
    const camelCase = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .map((word, index) => {
        if (word.length === 0) return word;
        if (index === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');

    return { success: true, result: camelCase };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert to camelCase';
    return { success: false, error: errorMessage };
  }
};

/**
 * Reverses text while preserving word order or character order
 */
export const reverseText = (text: string, reverseWords: boolean = false): TextProcessingResult => {
  if (!text) {
    return { success: true, result: '' };
  }

  try {
    if (reverseWords) {
      // Reverse word order
      const words = text.split(' ');
      return { success: true, result: words.reverse().join(' ') };
    } else {
      // Reverse character order
      return { success: true, result: text.split('').reverse().join('') };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reverse text';
    return { success: false, error: errorMessage };
  }
};