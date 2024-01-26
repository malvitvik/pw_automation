import {test, expect} from '@playwright/test';

test.describe('Locators examples', async () => {
    
    test.beforeEach(async ({page}) => {
        await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    });
    
    test('Radio Button Example', async ({page}) => {
        await page.check('[type="radio"][value="radio2"]');
        await expect(page.locator('[type="radio"][value="radio2"]')).toBeChecked();
        await expect(page.locator('[type="radio"][value="radio1"]')).not.toBeChecked();
    });

    test('Checkbox Example', async ({page}) => {
        await page.check('[type="checkbox"][value="option2"]');
        await expect(page.locator('[type="checkbox"][name="checkBoxOption2"]')).toBeChecked();
        await expect(page.locator('[type="checkbox"][value="option1"]')).not.toBeChecked();
    });

    test('Dropdown Example', async ({page}) => {
        await page.selectOption('[name="dropdown-class-example"]', 'option2');
        await expect(page.locator('[name="dropdown-class-example"]')).toHaveValue('option2');
    });

    test('Suggestion Example', async ({page}) => {
        const  country = 'India';
        
        await page.fill('#autocomplete', country.slice(0, 3));
        await page.getByText(country, { exact: true }).click();
        await expect(page.locator('#autocomplete')).toHaveValue(country);
    });

    test('Switch Window Example', async ({page, context}) => {
        const pagePromise = context.waitForEvent('page');

        await page.click('#openwindow');
        await pagePromise;
        expect(context.pages()).toHaveLength(2);
        await expect(context.pages()[1]).toHaveURL('https://www.qaclickacademy.com/');
    });

    test('Switch Tab Example', async ({page, context}) => {
        const pagePromise = context.waitForEvent('page');
        
        await page.click('#opentab');
        await pagePromise;
        expect(context.pages()).toHaveLength(2);
        await expect(context.pages()[1]).toHaveURL('https://www.qaclickacademy.com/');
    });

    test('Switch Alert Example', async ({page}) => {
        const value = 'TestUser';
        page.on('dialog', dialog => dialog.accept());
        
        await page.fill('#name', value);
        await page.click('#alertbtn');
    });

    test('Switch Confirm Example', async ({page}) => {
        const value = 'UserName';
        page.on('dialog', dialog => dialog.accept('hello'));

        await page.fill('#name', value);
        await page.click('#confirmbtn');
    });

    test('Element Displayed Example', async ({page}) => {
        const value = 'hello';
        const field = page.locator('[name="show-hide"]');

        await field.fill(value);
        
        await page.click('#hide-textbox');
        await expect(field).toBeHidden();
        
        await page.click('#show-textbox');
        await expect(field).toBeVisible();
    });

    test('Web Table Example', async ({page}) => {
        const amounts = await page.locator('.tableFixHead table#product td:last-child').allTextContents();
        const sum = '' + amounts.reduce((aggregator, current) => aggregator += +current, 0);
        
        await expect(page.locator('.totalAmount')).toContainText(sum);
    });

    test('Mouse Hover Example', async ({page}) => {
        await page.hover('#mousehover');
        await page.click(".mouse-hover-content a[href='#top']");
        
        await expect(page).toHaveURL(/.*#top$/g);
    });

    test('iFrame Example', async ({page}) => {
        let heading = page.frameLocator("#courses-iframe").getByRole('heading');

        expect(await heading.allTextContents()).toHaveLength(30);
        await expect(heading.first()).toContainText('QA Career');
    });

    test('Broken links', async ({page, request}) => {
        const hrefs = await page.evaluate(() => {
            return Array.from(document.links).map(item => item.href);
        });

        for (let url of hrefs) {
            let response = await request.head(url);
            console.log(`Checking ${url}`);
            expect.soft(response.ok()).toBeTruthy();
        }
    });
});