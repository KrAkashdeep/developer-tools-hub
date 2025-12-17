'use client';

import { useCallback } from 'react';
import {
  trackEvent,
  trackToolUsage,
  trackButtonClick,
  trackFormSubmission,
  trackInteraction,
  trackSearch,
  trackCategoryView,
  trackExternalLink,
} from '@/lib/utils/analytics';

export const useAnalytics = () => {
  const track = useCallback((eventName: string, parameters: Record<string, any> = {}) => {
    trackEvent(eventName, parameters);
  }, []);

  const trackTool = useCallback((toolName: string, toolCategory?: string) => {
    trackToolUsage(toolName, toolCategory);
  }, []);

  const trackButton = useCallback((buttonName: string, location?: string) => {
    trackButtonClick(buttonName, location);
  }, []);

  const trackForm = useCallback((formName: string, success: boolean = true) => {
    trackFormSubmission(formName, success);
  }, []);

  const trackUserInteraction = useCallback((type: string, name: string, additionalParams: Record<string, any> = {}) => {
    trackInteraction(type, name, additionalParams);
  }, []);

  const trackSearchQuery = useCallback((searchTerm: string, resultsCount?: number) => {
    trackSearch(searchTerm, resultsCount);
  }, []);

  const trackCategory = useCallback((categoryName: string) => {
    trackCategoryView(categoryName);
  }, []);

  const trackExternal = useCallback((url: string, linkText?: string) => {
    trackExternalLink(url, linkText);
  }, []);

  return {
    track,
    trackTool,
    trackButton,
    trackForm,
    trackUserInteraction,
    trackSearchQuery,
    trackCategory,
    trackExternal,
  };
};