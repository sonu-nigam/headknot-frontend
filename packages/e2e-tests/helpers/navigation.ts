import { type Page } from '@playwright/test';

export async function navigateTo(page: Page, path: string) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
}

export async function navigateViaSidebar(page: Page, label: string) {
    await page.getByRole('link', { name: new RegExp(label, 'i') }).click();
    await page.waitForLoadState('networkidle');
}

export async function openCommandPalette(page: Page) {
    await page.keyboard.press('Meta+k');
    await page.waitForSelector('[data-slot="command-input"]');
}

export async function searchInCommandPalette(page: Page, query: string) {
    await openCommandPalette(page);
    await page.locator('[data-slot="command-input"]').fill(query);
    // Wait for debounced search results
    await page.waitForTimeout(500);
}
