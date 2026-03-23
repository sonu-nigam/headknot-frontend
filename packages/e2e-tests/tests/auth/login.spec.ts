import { test, expect } from '@playwright/test';
import { login, TEST_USER } from '../../helpers/auth';

test.describe('Login', () => {
    test('should show login form', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByPlaceholder(/username/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(
            page.getByRole('button', { name: /log\s*in|sign\s*in/i }),
        ).toBeVisible();
    });

    test('should login with valid credentials and redirect to dashboard', async ({
        page,
    }) => {
        await login(page);
        await expect(page).toHaveURL('/');
        await expect(page.locator('text=Headknot')).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder(/username/i).fill('wronguser');
        await page.getByPlaceholder(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
        // Should stay on login page
        await expect(page).toHaveURL(/\/login/);
    });

    test('should have link to signup page', async ({ page }) => {
        await page.goto('/login');
        await page.getByText(/sign\s*up/i).click();
        await expect(page).toHaveURL(/\/signup/);
    });

    test('should have Google OAuth button', async ({ page }) => {
        await page.goto('/login');
        await expect(
            page.getByRole('button', { name: /google/i }),
        ).toBeVisible();
    });

    test('should redirect unauthenticated users to login', async ({
        page,
    }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login/);
    });
});
