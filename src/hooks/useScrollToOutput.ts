import { useCallback } from 'react';

export const useScrollToOutput = () => {
  const scrollToOutput = useCallback(() => {
    // Small delay to ensure the output is rendered
    setTimeout(() => {
      const outputElement = document.querySelector('[data-output-section="true"]');
      if (outputElement) {
        outputElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }, []);

  return scrollToOutput;
};