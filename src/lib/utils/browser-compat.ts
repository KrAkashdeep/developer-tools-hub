// Browser compatibility utilities and feature detection

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    clipboard: boolean;
    localStorage: boolean;
    webWorkers: boolean;
    es6: boolean;
    css3: boolean;
  };
}

export function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined') {
    return {
      name: 'server',
      version: '0',
      isSupported: true,
      features: {
        clipboard: false,
        localStorage: false,
        webWorkers: false,
        es6: true,
        css3: true,
      }
    };
  }

  const userAgent = window.navigator.userAgent;
  let name = 'unknown';
  let version = '0';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || '0';
  } else if (userAgent.includes('Firefox')) {
    name = 'firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || '0';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || '0';
  } else if (userAgent.includes('Edg')) {
    name = 'edge';
    version = userAgent.match(/Edg\/(\d+)/)?.[1] || '0';
  }

  const versionNum = parseInt(version);
  
  // Define minimum supported versions
  const minVersions = {
    chrome: 80,
    firefox: 75,
    safari: 13,
    edge: 80,
  };

  const isSupported = versionNum >= (minVersions[name as keyof typeof minVersions] || 0);

  return {
    name,
    version,
    isSupported,
    features: detectFeatures(),
  };
}

export function detectFeatures() {
  if (typeof window === 'undefined') {
    return {
      clipboard: false,
      localStorage: false,
      webWorkers: false,
      es6: false,
      css3: false,
    };
  }

  return {
    clipboard: 'clipboard' in navigator && 'writeText' in navigator.clipboard,
    localStorage: (() => {
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    webWorkers: 'Worker' in window,
    es6: (() => {
      try {
        // Test for arrow functions, const/let, template literals
        eval('const test = () => `test`');
        return true;
      } catch {
        return false;
      }
    })(),
    css3: (() => {
      const testElement = document.createElement('div');
      return (
        'transform' in testElement.style ||
        'webkitTransform' in testElement.style ||
        'mozTransform' in testElement.style
      );
    })(),
  };
}

export function showBrowserWarning(browserInfo: BrowserInfo): void {
  if (browserInfo.isSupported) return;

  const warningDiv = document.createElement('div');
  warningDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      padding: 12px;
      text-align: center;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <strong>Browser Not Fully Supported</strong> - 
      You're using ${browserInfo.name} ${browserInfo.version}. 
      For the best experience, please update to a newer version or use Chrome, Firefox, Safari, or Edge.
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        margin-left: 12px;
        border-radius: 4px;
        cursor: pointer;
      ">×</button>
    </div>
  `;
  
  document.body.appendChild(warningDiv);
}

// Polyfills for older browsers
export function loadPolyfills(): Promise<void> {
  // For now, we'll skip external polyfills and rely on modern browser features
  // In production, you might want to add specific polyfills as needed
  return Promise.resolve();
}

// Feature-based fallbacks
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        resolve();
      } else {
        reject(new Error('Copy command failed'));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  });
}

export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Fallback to cookies or memory storage
    return null;
  }
}

export function setStorageItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // Fallback to cookies or memory storage
    return false;
  }
}

// Initialize browser compatibility checks
export function initializeBrowserCompat(): void {
  if (typeof window === 'undefined') return;

  const browserInfo = detectBrowser();
  
  // Show warning for unsupported browsers
  if (!browserInfo.isSupported) {
    showBrowserWarning(browserInfo);
  }

  // Load polyfills if needed
  loadPolyfills();

  // Log browser info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser compatibility:', browserInfo);
  }
}