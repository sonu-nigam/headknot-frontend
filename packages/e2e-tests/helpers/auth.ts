import { type Page } from '@playwright/test';

const TEST_USER = {
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'testpassword123',
    fullName: process.env.TEST_FULLNAME || 'Test User',
};

export async function login(page: Page) {
    await page.goto('/login');
    await page.getByPlaceholder(/username/i).fill(TEST_USER.username);
    await page.getByPlaceholder(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
    await page.waitForURL('/');
}

export async function signup(page: Page, user?: Partial<typeof TEST_USER>) {
    const u = { ...TEST_USER, ...user };
    await page.goto('/signup');
    await page.getByPlaceholder(/full\s*name/i).fill(u.fullName);
    await page.getByPlaceholder(/username/i).fill(u.username);
    await page.getByPlaceholder(/password/i).fill(u.password);
    await page.getByRole('button', { name: /sign\s*up|create/i }).click();
    await page.waitForURL('/');
}

export async function logout(page: Page) {
    // Open sidebar user menu and click logout
    await page.getByRole('button', { name: /user|profile|avatar/i }).click();
    await page.getByText(/log\s*out/i).click();
    await page.waitForURL(/\/login/);
}

export { TEST_USER };
