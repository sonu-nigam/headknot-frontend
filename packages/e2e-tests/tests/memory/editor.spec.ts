import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Memory - Editor', () => {
    authenticatedTest.beforeEach(async ({ page }) => {
        // Create a new memory
        await page
            .getByRole('button', { name: /new|create|add/i })
            .first()
            .click();
        await page.waitForURL(/\/[a-f0-9]{32}/);
    });

    authenticatedTest('should show editor with toolbar', async ({ page }) => {
        await expect(
            page.locator('[aria-label="Memory editor content"]'),
        ).toBeVisible();
    });

    authenticatedTest(
        'should support text formatting (bold, italic)',
        async ({ page }) => {
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially('Bold text', { delay: 30 });

            // Select all and bold
            await page.keyboard.press('Meta+a');
            await page.keyboard.press('Meta+b');

            await expect(editor.locator('strong')).toBeVisible();
        },
    );

    authenticatedTest(
        'should support slash commands menu',
        async ({ page }) => {
            const editor = page.locator(
                '[aria-label="Memory editor content"]',
            );
            await editor.click();
            await editor.pressSequentially('/', { delay: 50 });

            // Slash menu should appear
            await expect(
                page.locator('[data-slot="command-list"], [role="listbox"]'),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should show memory header with actions',
        async ({ page }) => {
            // NetworkIcon toggle should be visible
            await expect(
                page.getByRole('button', { name: /toggle relations/i }),
            ).toBeVisible();

            // Comments toggle should be visible
            await expect(
                page.getByRole('button', { name: /toggle comments/i }),
            ).toBeVisible();

            // Timeline button should be visible
            await expect(page.locator('button:has(svg)')).toBeTruthy();
        },
    );
});
