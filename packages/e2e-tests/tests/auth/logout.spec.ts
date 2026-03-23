import { test, expect } from '@playwright/test';
import { login, logout } from '../../helpers/auth';

test.describe('Logout', () => {
    test('should logout and redirect to login', async ({ page }) => {
        await login(page);
        await expect(page).toHaveURL('/');

        await logout(page);
        await expect(page).toHaveURL(/\/login/);
    });

    test('should not access protected routes after logout', async ({
        page,
    }) => {
        await login(page);
        await logout(page);

        await page.goto('/');
        await expect(page).toHaveURL(/\/login/);
    });
});
