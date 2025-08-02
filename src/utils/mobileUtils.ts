// Mobile detection utility
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if screen width is mobile-sized
export const isMobileScreen = (): boolean => {
  return window.innerWidth <= 768;
};

// Get the appropriate watch URL based on device type
export const getWatchUrl = (mediaType: string, tmdbId: string): string => {
  if (isMobileDevice() || isMobileScreen()) {
    return `/mobile/watch/${mediaType}/${tmdbId}`;
  }
  return `/watch/${mediaType}/${tmdbId}`;
};

// Mobile-specific viewport settings
export const setMobileViewport = (): void => {
  if (isMobileDevice()) {
    // Prevent zooming on mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }
};

// Handle mobile-specific touch events
export const addMobileTouchHandlers = (element: HTMLElement, onTap: () => void): void => {
  let touchStartTime = 0;
  let touchEndTime = 0;
  const longPressDelay = 500;

  element.addEventListener('touchstart', (_e) => {
    touchStartTime = new Date().getTime();
  });

  element.addEventListener('touchend', (_e) => {
    touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    
    if (touchDuration < longPressDelay) {
      onTap();
    }
  });
}; 