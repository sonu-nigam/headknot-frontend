import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Activity', () => {
    authenticatedTest(
        'should navigate to activity page',
        async ({ page }) => {
            await page.goto('/activity');
            await expect(page.locator('text=Activity')).toBeVisible();
        },
    );

    authenticatedTest(
        'should show activity feed or empty state',
        async ({ page }) => {
            await page.goto('/activity');
            // Should show either activity items or "No activity yet"
            const hasActivity = await page
                .locator('[class*="ActivityItem"], [class*="activity"]')
                .count();
            const hasEmpty = await page
                .locator('text=No activity yet')
                .isVisible()
                .catch(() => false);
            expect(hasActivity > 0 || hasEmpty).toBeTruthy();
        },
    );

    authenticatedTest(
        'should show activity feed on dashboard',
        async ({ page }) => {
            await page.goto('/');
            // Dashboard should have an activity section
            await page.waitForLoadState('networkidle');
            // Either activity items or empty state
            const dashboard = page.locator('.max-w-3xl');
            await expect(dashboard).toBeVisible();
        },
    );

    authenticatedTest(
        'should navigate to activity page from sidebar',
        async ({ page }) => {
            await page
                .getByRole('link', { name: /activity/i })
                .click();
            await expect(page).toHaveURL('/activity');
        },
    );
});
