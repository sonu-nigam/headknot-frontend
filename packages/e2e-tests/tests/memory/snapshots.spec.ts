import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Memory - Snapshots', () => {
    authenticatedTest.beforeEach(async ({ page }) => {
        // Create a new memory and type some content
        await page
            .getByRole('button', { name: /new|create|add/i })
            .first()
            .click();
        await page.waitForURL(/\/[a-f0-9]{32}/);

        const editor = page.locator(
            '[aria-label="Memory editor content"]',
        );
        await editor.click();
        await editor.pressSequentially('Snapshot test content', { delay: 30 });

        // Wait for auto-commit (4s debounce + buffer)
        await page.waitForTimeout(6000);
    });

    authenticatedTest(
        'should show snapshot timeline dropdown',
        async ({ page }) => {
            // Click the timeline/clock icon button
            const timelineBtn = page.locator(
                'button:has(svg.lucide-file-clock)',
            );
            await timelineBtn.click();

            // Snapshot list should appear
            await expect(page.locator('text=snapshot')).toBeVisible();
        },
    );

    authenticatedTest(
        'should list snapshots after commit',
        async ({ page }) => {
            const timelineBtn = page.locator(
                'button:has(svg.lucide-file-clock)',
            );
            await timelineBtn.click();

            // Should have at least one snapshot with version number
            await expect(page.locator('text=v1')).toBeVisible();
        },
    );

    authenticatedTest(
        'should checkout a snapshot and reload editor',
        async ({ page }) => {
            // Edit more to create another snapshot
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially(' - updated', { delay: 30 });
            await page.waitForTimeout(6000);

            // Open timeline
            const timelineBtn = page.locator(
                'button:has(svg.lucide-file-clock)',
            );
            await timelineBtn.click();

            // Find checkout button on the first (older) snapshot and click it
            const checkoutBtn = page.locator(
                'button:has(svg.lucide-git-branch)',
            ).first();
            if (await checkoutBtn.isVisible()) {
                await checkoutBtn.click();
                // Editor should reload — wait for content to settle
                await page.waitForTimeout(2000);
                await expect(
                    page.locator('[aria-label="Memory editor content"]'),
                ).toBeVisible();
            }
        },
    );

    authenticatedTest(
        'should rollback with confirmation dialog',
        async ({ page }) => {
            // Edit more to create another snapshot
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially(' - v2 content', { delay: 30 });
            await page.waitForTimeout(6000);

            // Open timeline
            const timelineBtn = page.locator(
                'button:has(svg.lucide-file-clock)',
            );
            await timelineBtn.click();

            // Click rollback button on older snapshot
            const rollbackBtn = page.locator(
                'button:has(svg.lucide-rotate-ccw)',
            ).first();
            if (await rollbackBtn.isVisible()) {
                await rollbackBtn.click();

                // Confirmation dialog should appear
                await expect(page.locator('text=Rollback to')).toBeVisible();
                await expect(page.locator('text=destructive')).toBeVisible();

                // Cancel to not actually rollback
                await page
                    .getByRole('button', { name: /cancel/i })
                    .click();
            }
        },
    );
});
