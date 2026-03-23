import { test as base, expect } from '@playwright/test';
import { login } from './auth';

/**
 * Extended test fixture that provides an authenticated page.
 * Use `authenticatedTest` instead of `test` when the test requires login.
 */
export const authenticatedTest = base.extend<{ authenticatedPage: void }>({
    authenticatedPage: [
        async ({ page }, use) => {
            await login(page);
            await use();
        },
        { auto: true },
    ],
});

export { expect };
