import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// gtag.js is loaded and configured in index.html with send_page_view disabled,
// so we send a page_view here on first load and on every client-side route
// change — otherwise an SPA only ever reports the initial page.

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

/** Record a GA4 page_view for the given path. */
export function trackPageview(path: string) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}

/** Fire a page_view on first load and on every client-side route change. */
export function usePageTracking() {
    const { pathname, search } = useLocation();
    useEffect(() => {
        trackPageview(pathname + search);
    }, [pathname, search]);
}
