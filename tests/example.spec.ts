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

  // --- Slider Component Tests ---
  const sliderContainer = page.locator(".slider-container");
  const sliderButtons = page.locator(".slider-button");
  const sliderInput = page.locator(".slider-input");

  await expect(sliderContainer).toBeVisible();
  expect(await sliderButtons.count()).toBe(2);
  await expect(sliderInput).toBeVisible();

  // Get computed styles
  const sliderContainerWidth = await sliderContainer.evaluate(
    (el) => getComputedStyle(el).width
  );
  const sliderButtonWidth = await sliderButtons
    .nth(0)
    .evaluate((el) => getComputedStyle(el).width);
  const sliderInputHeight = await sliderInput.evaluate(
    (el) => getComputedStyle(el).height
  );

  expect(parseFloat(sliderContainerWidth)).toBeCloseTo(320, 0);
  expect(parseFloat(sliderButtonWidth)).toBeCloseTo(30, 0);
  expect(parseFloat(sliderInputHeight)).toBeCloseTo(20, 0);
  await expect(sliderInput).toHaveAttribute("type", "range");

  // Test slider increase/decrease
  let initialSliderValue = parseInt(await sliderInput.inputValue());
  await sliderButtons.nth(1).click(); // Increase button
  expect(parseInt(await sliderInput.inputValue())).toBe(initialSliderValue + 1);
  await sliderButtons.nth(0).click(); // Decrease button
  expect(parseInt(await sliderInput.inputValue())).toBe(initialSliderValue);

  // --- Button Component Tests ---
  const button = page.locator(".button");
  await expect(button).toBeVisible();

  const buttonWidth = await button.evaluate((el) => getComputedStyle(el).width);
  const buttonHeight = await button.evaluate(
    (el) => getComputedStyle(el).height
  );

  expect(parseFloat(buttonWidth)).toBeCloseTo(100, 0);
  expect(parseFloat(buttonHeight)).toBeCloseTo(40, 0);

  // Switch to Tab 2 and check content
  await tab2.click();
  const tab2Content = page.locator("p", { hasText: "Tab 2 Content" });
  await expect(tab2Content).toBeVisible();

  // Switch back to Tab 1
  await tab1.click();

  console.log("Test completed successfully.");
});
