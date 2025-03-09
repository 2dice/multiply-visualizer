import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const title = page.locator("h1");
  await expect(title).toHaveText("Vite + React");
  console.log("Test completed successfully.");
});
