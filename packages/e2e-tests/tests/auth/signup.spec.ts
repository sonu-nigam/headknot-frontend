import { test, expect } from '@playwright/test';

test.describe('Signup', () => {
    test('should show signup form', async ({ page }) => {
        await page.goto('/signup');
        await expect(page.getByPlaceholder(/full\s*name/i)).toBeVisible();
        await expect(page.getByPlaceholder(/username/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(
            page.getByRole('button', { name: /sign\s*up|create/i }),
        ).toBeVisible();
    });

    test('should signup with valid data and redirect to dashboard', async ({
        page,
    }) => {
        const uniqueUser = `testuser_${Date.now()}`;
        await page.goto('/signup');
        await page.getByPlaceholder(/full\s*name/i).fill('E2E Test User');
        await page.getByPlaceholder(/username/i).fill(uniqueUser);
        await page.getByPlaceholder(/password/i).fill('testpassword123');
        await page.getByRole('button', { name: /sign\s*up|create/i }).click();
        await expect(page).toHaveURL('/');
    });

    test('should have link to login page', async ({ page }) => {
        await page.goto('/signup');
        await page.getByText(/log\s*in/i).click();
        await expect(page).toHaveURL(/\/login/);
    });

    test('should have Google OAuth button', async ({ page }) => {
        await page.goto('/signup');
        await expect(
            page.getByRole('button', { name: /google/i }),
        ).toBeVisible();
    });
});
