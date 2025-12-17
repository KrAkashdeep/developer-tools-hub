// Google Analytics 4 utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') {
    return;
  }

  // Create script tag for GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Generic event tracking function
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) {
    console.log('GA4 Debug:', eventName, parameters); // Debug in development
    return;
  }

  window.gtag('event', eventName, {
    event_category: parameters.category || 'engagement',
    event_label: parameters.label,
    value: parameters.value,
    ...parameters,
  });
};

// Specific tracking functions for common interactions

// Track tool usage
export const trackToolUsage = (toolName: string, toolCategory?: string) => {
  trackEvent('tool_used', {
    tool_name: toolName,
    tool_category: toolCategory,
    category: 'tools',
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_clicked', {
    button_name: buttonName,
    button_location: location,
    category: 'ui_interaction',
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submitted', {
    form_name: formName,
    form_success: success,
    category: 'forms',
  });
};

// Track generic interactions
export const trackInteraction = (type: string, name: string, additionalParams: Record<string, any> = {}) => {
  trackEvent('interaction', {
    interaction_type: type,
    interaction_name: name,
    category: 'user_interaction',
    ...additionalParams,
  });
};

// Track search queries
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    search_results: resultsCount,
    category: 'search',
  });
};

// Track category navigation
export const trackCategoryView = (categoryName: string) => {
  trackEvent('category_viewed', {
    category_name: categoryName,
    category: 'navigation',
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  trackEvent('external_link_clicked', {
    link_url: url,
    link_text: linkText,
    category: 'outbound_links',
  });
};