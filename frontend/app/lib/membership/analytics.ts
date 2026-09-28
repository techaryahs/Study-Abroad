export const trackMembershipEvent = (eventName: string, data?: Record<string, any>) => {
  // Try to use a global analytics tracker if available (e.g. gtag or segment)
  try {
    if (typeof window !== "undefined") {
      // Example placeholder for Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', eventName, data);
      }
      
      // Log to console for development purposes
      console.log(`[Analytics Event] ${eventName}`, data || {});
    }
  } catch (error) {
    console.error(`Failed to track event ${eventName}`, error);
  }
};
