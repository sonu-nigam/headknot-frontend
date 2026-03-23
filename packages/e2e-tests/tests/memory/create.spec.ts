import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Memory - Create', () => {
    authenticatedTest(
        'should create a new memory from sidebar',
        async ({ page }) => {
            // Click create memory button in sidebar
            await page
                .getByRole('button', { name: /new|create|add/i })
                .first()
                .click();

            // Should navigate to new memory page
            await page.waitForURL(/\/[a-f0-9]{32}/);

            // Editor should be visible
            await expect(
                page.locator('[aria-label="Memory editor content"]'),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should create memory and auto-save on edit',
        async ({ page }) => {
            await page
                .getByRole('button', { name: /new|create|add/i })
                .first()
                .click();
            await page.waitForURL(/\/[a-f0-9]{32}/);

            // Type in the editor
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially('Hello World', { delay: 50 });

            // Wait for auto-save (throttle is 2s)
            await page.waitForTimeout(3000);

            // Reload and verify content persisted
            await page.reload();
            await expect(page.locator('text=Hello World')).toBeVisible();
        },
    );
});
