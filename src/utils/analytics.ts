import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = () => {
  // Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
  ReactGA.initialize('G-388YTCB09B');
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track custom events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Specific event tracking functions
export const trackSaveList = (listName: string, listingCount: number) => {
  trackEvent('Lists', 'Save', listName, listingCount);
};

export const trackImportList = (listCount: number) => {
  trackEvent('Lists', 'Import', undefined, listCount);
};

export const trackExportList = (listName: string, listingCount: number) => {
  trackEvent('Lists', 'Export', listName, listingCount);
}; 