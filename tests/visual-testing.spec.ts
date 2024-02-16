import {test, expect} from '@playwright/test';

test.describe('Visual testing', async () => {
    test('Take screenshot', async ({ page }) => {
        await page.goto('/AutomationPractice/');
        await page.screenshot({ path: 'page.png' });
        await page.getByRole('textbox', { name: 'Hide/Show Example'}).screenshot({ path: 'textbox.png' });
    });
    
    test('Visual Comparison', async ({ page }) => {
        await page.goto('/AutomationPractice/');
        expect(await page.screenshot()).toMatchSnapshot('automationPractice.png');
    });

});