const SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loadPromise: Promise<void> | null = null;

/**
 * Loads the Razorpay Standard Checkout script once and resolves when `window.Razorpay` is ready.
 * Subsequent calls return the same promise (or resolve immediately if already loaded).
 */
export function loadRazorpayScript(): Promise<void> {
    if (typeof window !== 'undefined' && window.Razorpay) {
        return Promise.resolve();
    }
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${SRC}"]`,
        );
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () =>
                reject(new Error('Failed to load Razorpay checkout')),
            );
            return;
        }

        const script = document.createElement('script');
        script.src = SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            loadPromise = null; // allow a retry on next attempt
            reject(new Error('Failed to load Razorpay checkout'));
        };
        document.body.appendChild(script);
    });

    return loadPromise;
}
