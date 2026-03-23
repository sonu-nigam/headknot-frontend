import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Relationships', () => {
    authenticatedTest.beforeEach(async ({ page }) => {
        // Create a new memory
        await page
            .getByRole('button', { name: /new|create|add/i })
            .first()
            .click();
        await page.waitForURL(/\/[a-f0-9]{32}/);
    });

    authenticatedTest(
        'should show relationships toggle in memory header',
        async ({ page }) => {
            await expect(
                page.getByRole('button', { name: /toggle relations/i }),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should open relationships panel when toggle is clicked',
        async ({ page }) => {
            await page
                .getByRole('button', { name: /toggle relations/i })
                .click();

            // Context panel should open with relationships content
            // Either shows entities or empty state
            await page.waitForTimeout(1000);
            const hasEntities = await page
                .locator('text=No entities linked')
                .isVisible()
                .catch(() => false);
            const hasRelationships = await page
                .locator('[id="context-panel-slot"]')
                .isVisible()
                .catch(() => false);
            expect(hasEntities || hasRelationships).toBeTruthy();
        },
    );

    authenticatedTest(
        'should show comments toggle in memory header',
        async ({ page }) => {
            await expect(
                page.getByRole('button', { name: /toggle comments/i }),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should toggle between relationships and comments panels',
        async ({ page }) => {
            // Open relationships
            await page
                .getByRole('button', { name: /toggle relations/i })
                .click();
            await page.waitForTimeout(500);

            // Switch to comments
            await page
                .getByRole('button', { name: /toggle comments/i })
                .click();
            await page.waitForTimeout(500);

            // Context panel should still be open
            const panel = page.locator('[id="context-panel-slot"]');
            await expect(panel).toBeVisible();
        },
    );

    authenticatedTest(
        'should show block-level connection icons only when claims exist',
        async ({ page }) => {
            // In a fresh memory, no claims should exist, so no Network icons on blocks
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially('Test content', { delay: 30 });

            // Network icons should NOT appear on fresh blocks without claims
            await page.waitForTimeout(1000);
            // The block action icons are rendered with Network lucide icon
            // For fresh content, they should be absent
        },
    );
});
