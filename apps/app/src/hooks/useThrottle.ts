import { useRef, useCallback } from 'react';

const useThrottle = (callback, delay) => {
    const lastRun = useRef(0);
    const timeoutId = useRef(null);

    const throttledCallback = useCallback(
        (...args) => {
            const now = Date.now();

            if (now - lastRun.current >= delay) {
                // Execute immediately if delay has passed
                callback(...args);
                lastRun.current = now;
            } else {
                // Clear any existing timeout and set a new one
                clearTimeout(timeoutId.current);
                timeoutId.current = setTimeout(
                    () => {
                        callback(...args);
                        lastRun.current = Date.now();
                        timeoutId.current = null; // Clear timeout ID after execution
                    },
                    delay - (now - lastRun.current),
                );
            }
        },
        [callback, delay],
    );

    return throttledCallback;
};

export default useThrottle;
