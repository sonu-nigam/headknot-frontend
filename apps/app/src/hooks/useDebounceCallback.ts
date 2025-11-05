import { useCallback, useRef, useEffect } from 'react';
import _ from 'lodash';

interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
}

/**
 * Custom hook that debounces a callback function using Lodash
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @param options - Optional Lodash debounce options
 * @returns A debounced version of the callback with cancel and flush methods
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: DebounceOptions,
): DebouncedFunction<T> {
    const callbackRef = useRef<T>(callback);
    const debouncedRef = useRef<_.DebouncedFunc<T> | null>(null);

    // Keep callback ref up to date
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Create debounced function
    useEffect(() => {
        debouncedRef.current = _.debounce(
            ((...args: Parameters<T>) => {
                return callbackRef.current(...args);
            }) as T,
            delay,
            options,
        );

        return () => {
            debouncedRef.current?.cancel();
        };
    }, [delay, options?.leading, options?.trailing, options?.maxWait]);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>): ReturnType<T> | undefined => {
            return debouncedRef.current?.(...args);
        },
        [],
    );

    // Expose cancel and flush methods
    const cancel = useCallback(() => {
        debouncedRef.current?.cancel();
    }, []);

    const flush = useCallback((): ReturnType<T> | undefined => {
        return debouncedRef.current?.flush();
    }, []);

    return Object.assign(debouncedCallback, { cancel, flush });
}

export default useDebounceCallback;
