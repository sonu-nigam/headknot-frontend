import { authenticatedTest, expect } from '../../helpers/fixtures';

authenticatedTest.describe('Workspace', () => {
    authenticatedTest(
        'should navigate to workspace page',
        async ({ page }) => {
            await page.goto('/workspace');
            await expect(page.locator('text=Workspaces')).toBeVisible();
        },
    );

    authenticatedTest(
        'should show create workspace button',
        async ({ page }) => {
            await page.goto('/workspace');
            await expect(
                page.getByRole('button', { name: /create workspace/i }),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should open create workspace dialog',
        async ({ page }) => {
            await page.goto('/workspace');
            await page
                .getByRole('button', { name: /create workspace/i })
                .first()
                .click();

            await expect(page.locator('text=Create Workspace')).toBeVisible();
            await expect(
                page.getByPlaceholder(/my workspace/i),
            ).toBeVisible();
        },
    );

    authenticatedTest(
        'should create a new workspace',
        async ({ page }) => {
            await page.goto('/workspace');
            await page
                .getByRole('button', { name: /create workspace/i })
                .first()
                .click();

            const name = `Test Workspace ${Date.now()}`;
            await page.getByPlaceholder(/my workspace/i).fill(name);
            await page
                .getByPlaceholder(/description/i)
                .fill('E2E test workspace');
            await page
                .getByRole('button', { name: /create workspace/i })
                .last()
                .click();

            // Dialog should close and workspace should appear
            await page.waitForTimeout(1000);
            await expect(page.locator(`text=${name}`)).toBeVisible();
        },
    );

    authenticatedTest(
        'should show workspace card with edit and delete options',
        async ({ page }) => {
            await page.goto('/workspace');

            // Open dropdown on first workspace card
            const moreBtn = page
                .locator('button:has(svg.lucide-more-vertical)')
                .first();
            if (await moreBtn.isVisible()) {
                await moreBtn.click();
                await expect(page.locator('text=Edit')).toBeVisible();
                await expect(page.locator('text=Delete')).toBeVisible();
                await expect(page.locator('text=Members')).toBeVisible();
            }
        },
    );

    authenticatedTest(
        'should show activate/deactivate option in workspace menu',
        async ({ page }) => {
            await page.goto('/workspace');

            const moreBtn = page
                .locator('button:has(svg.lucide-more-vertical)')
                .first();
            if (await moreBtn.isVisible()) {
                await moreBtn.click();
                // Should have either Activate or Deactivate
                const hasActivate = await page
                    .locator('text=Activate')
                    .isVisible()
                    .catch(() => false);
                const hasDeactivate = await page
                    .locator('text=Deactivate')
                    .isVisible()
                    .catch(() => false);
                expect(hasActivate || hasDeactivate).toBeTruthy();
            }
        },
    );

    authenticatedTest(
        'should open members dialog',
        async ({ page }) => {
            await page.goto('/workspace');

            const moreBtn = page
                .locator('button:has(svg.lucide-more-vertical)')
                .first();
            if (await moreBtn.isVisible()) {
                await moreBtn.click();
                await page.locator('text=Members').click();
                await expect(
                    page.locator('text=Workspace Members'),
                ).toBeVisible();
            }
        },
    );
});
