import { test, expect } from "@playwright/test";

test("Check UI components and interactions", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Check for console errors
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`Console ${msg.type()}: ${msg.text()}`);
      expect(msg.type()).not.toBe("error");
      expect(msg.type()).not.toBe("warning");
    }
  });

  // Check if tabs are visible
  const tab1 = page.locator(".tab", { hasText: "Tab 1" });
  const tab2 = page.locator(".tab", { hasText: "Tab 2" });
  await expect(tab1).toBeVisible();
  await expect(tab2).toBeVisible();

  // Check if slider is visible and interacts
  const slider = page.locator(".slider");
  await expect(slider).toBeVisible();
  await slider.click(); // Click to change value (Playwright simulates user interaction)
  // Add: Get slider value and check
  const sliderValue = await slider.inputValue();
  expect(Number(sliderValue)).toBeGreaterThanOrEqual(0);
  expect(Number(sliderValue)).toBeLessThanOrEqual(100);

  // Check if button is visible and interacts
  const button = page.locator(".button", { hasText: "Click Me" });
  await expect(button).toBeVisible();
  await button.click();

  // Switch to Tab 2 and check content
  await tab2.click();
  const tab2Content = page.locator("p", { hasText: "Tab 2 Content" });
  await expect(tab2Content).toBeVisible();

  // Switch back to Tab 1
  await tab1.click();
  await expect(slider).toBeVisible(); // Check if slider is visible again

  console.log("Test completed successfully.");
});
