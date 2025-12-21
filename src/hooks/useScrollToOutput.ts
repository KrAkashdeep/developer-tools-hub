import { useCallback } from 'react';

export const useScrollToOutput = () => {
  const scrollToOutput = useCallback(() => {
    // Small delay to ensure the output is rendered
    setTimeout(() => {
      const outputElement = document.querySelector('[data-output-section="true"]');
      if (outputElement) {
        // Check if we're on mobile (screen width < 768px)
        const isMobile = window.innerWidth < 768;
        
        outputElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: isMobile ? 'center' : 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }, []);

  return scrollToOutput;
};