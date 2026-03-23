import { authenticatedTest, expect } from '../../helpers/fixtures';
import {
    openCommandPalette,
    searchInCommandPalette,
} from '../../helpers/navigation';

authenticatedTest.describe('Search', () => {
    authenticatedTest(
        'should open command palette with Cmd+K',
        async ({ page }) => {
            await openCommandPalette(page);
            await expect(
                page.locator('[data-slot="command-input"]'),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should open command palette from sidebar search button',
        async ({ page }) => {
            await page.getByRole('button', { name: /search/i }).click();
            await expect(
                page.locator('[data-slot="command-input"]'),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should open command palette from dashboard search bar',
        async ({ page }) => {
            await page.goto('/');
            // Click the search trigger on dashboard
            await page.locator('text=Search, recall').click();
            await expect(
                page.locator('[data-slot="command-input"]'),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should show navigation shortcuts in command palette',
        async ({ page }) => {
            await openCommandPalette(page);
            await expect(page.locator('text=Dashboard')).toBeVisible();
            await expect(page.locator('text=Workspaces')).toBeVisible();
            await expect(page.locator('text=Activity')).toBeVisible();
        },
    );

    authenticatedTest(
        'should navigate to dashboard from command palette',
        async ({ page }) => {
            await page.goto('/workspace');
            await openCommandPalette(page);
            await page.locator('[data-slot="command-item"]', { hasText: 'Dashboard' }).click();
            await expect(page).toHaveURL('/');
        },
    );

    authenticatedTest(
        'should show search results when typing a query',
        async ({ page }) => {
            await searchInCommandPalette(page, 'test');
            // Should show results or "No results found"
            const hasResults = await page
                .locator('[data-slot="command-item"]')
                .count();
            const hasEmpty = await page
                .locator('text=No results found')
                .isVisible()
                .catch(() => false);
            expect(hasResults > 0 || hasEmpty).toBeTruthy();
        },
    );

    authenticatedTest(
        'should close command palette with Escape',
        async ({ page }) => {
            await openCommandPalette(page);
            await page.keyboard.press('Escape');
            await expect(
                page.locator('[data-slot="command-input"]'),
            ).not.toBeVisible();
        },
    );
});
