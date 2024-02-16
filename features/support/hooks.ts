import {Before} from "@cucumber/cucumber";
import {chromium} from "@playwright/test";
import {PoManager} from "../../tests/store/pages/poManager";

Before(async function () {
    this.browser = await chromium.launch();
    const page = await this.browser.newPage();
    this.poManager = new PoManager(page);
    await this.poManager.loginPage.goto();
});