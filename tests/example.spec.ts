import { test, expect } from "@playwright/test";

test("has title", { tag: ["@FAILED"] }, async ({ page }, testInfo) => {
    if (testInfo.retry >= 1) {
        await page.goto("https://playwright.dev/");
    }
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
});

test(
    "get started link",
    { tag: ["@smoke", "@regression"] },
    async ({ page }) => {
        test.step("go to playwright.dev", async () => {
            await page.goto("https://playwright.dev/");
        });
        // Click the get started link.
        await page.getByRole("link", { name: "Get started" }).click();

        // Expects page to have a heading with the name of Installation.
        await expect(
            page.getByRole("heading", { name: "Installation" })
        ).toBeVisible();
    }
);
