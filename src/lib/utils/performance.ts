// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.logMetric('page-load', navEntry.loadEventEnd - navEntry.fetchStart);
          this.logMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
          this.logMetric('first-paint', navEntry.loadEventEnd - navEntry.fetchStart);
        }
      }
    });

    try {
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (e) {
      console.warn('Navigation timing observer not supported');
    }

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.name.includes('chunk') || resourceEntry.name.includes('.js')) {
            this.logMetric(`resource-${resourceEntry.name.split('/').pop()}`, resourceEntry.duration);
          }
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource timing observer not supported');
    }
  }

  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTimer(name: string): number | null {
    const startTime = this.metrics.get(name);
    if (startTime === undefined) {
      console.warn(`Timer "${name}" was not started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    this.logMetric(name, duration);
    return duration;
  }

  logMetric(name: string, duration: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }

    // In production, you might want to send this to an analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      });
    }
  }

  measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: Parameters<T>) => {
      this.startTimer(name);
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          this.endTimer(name);
        });
      } else {
        this.endTimer(name);
        return result;
      }
    }) as T;
  }

  getMetrics(): PerformanceMetrics[] {
    const entries = performance.getEntriesByType('measure');
    return entries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      timestamp: entry.startTime
    }));
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Utility functions for common performance measurements
export function measureSearchPerformance<T>(
  searchFn: (query: string) => T,
  query: string
): T {
  return performanceMonitor.measureFunction(searchFn, `search-${query.length}-chars`)(query);
}

export function measureToolProcessing<T>(
  processFn: () => T,
  toolName: string
): T {
  return performanceMonitor.measureFunction(processFn, `tool-${toolName}`)();
}

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    performanceMonitor.logMetric('lcp', lastEntry.startTime);
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // Measure First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fidEntry = entry as PerformanceEventTiming;
      performanceMonitor.logMetric('fid', fidEntry.processingStart - fidEntry.startTime);
    }
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observer not supported');
  }

  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShiftEntry = entry as any;
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value;
      }
    }
    performanceMonitor.logMetric('cls', clsValue);
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observer not supported');
  }
}

// Initialize web vitals measurement
if (typeof window !== 'undefined') {
  measureWebVitals();
}