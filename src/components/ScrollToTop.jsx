import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — scrolls to the top on every route change.
 * Handles both window-level scrolling (public pages) and
 * inner scrollable containers (dashboard pages with overflow-y-auto).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window itself
    window.scrollTo(0, 0);

    // Also scroll any dashboard main content container
    // (DashboardLayout uses overflow-y-auto on <main>, so window.scrollTo won't reach it)
    setTimeout(() => {
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTop = 0;
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
