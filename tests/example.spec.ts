import { test, expect } from "@playwright/test";

test("Check App structure and basic tab interactions", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Check for console errors or warnings during page load and initial interaction
  const messages: ("error" | "warning")[] = []; // 型を明示的に指定
  page.on("console", (msg) => {
    const msgType = msg.type();
    if (msgType === "error" || msgType === "warning") {
      console.log(`[Test Console Check] ${msgType}: ${msg.text()}`);
      messages.push(msgType as "error" | "warning"); // 型アサーションを追加
    }
  });

  // Wait for the main app container or tabs container to be visible
  const tabsContainer = page.locator(".tabs-container"); // App.jsx で追加したクラス名
  await expect(tabsContainer).toBeVisible({ timeout: 10000 }); // 10秒待機
  console.log("[Test Debug] Tabs container is visible.");

  // Check if initial tabs are visible (using getByRole with exact match)
  const gridTabButton = page.getByRole("button", {
    name: "グリッド",
    exact: true,
  });
  const gridDecompositionTabButton = page.getByRole("button", {
    name: "グリッド分解",
    exact: true,
  });
  const areaRectangleTabButton = page.getByRole("button", {
    name: "面積(長方形)",
    exact: true,
  });
  // Add checks for other tabs if needed

  await expect(gridTabButton).toBeVisible();
  await expect(gridDecompositionTabButton).toBeVisible();
  await expect(areaRectangleTabButton).toBeVisible();

  // Verify initial content (GridTab should be active by default)
  await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible();

  // --- Slider and Button tests removed, as they are now part of specific tab components ---

  // Switch to "グリッド分解" tab and check placeholder content
  await gridDecompositionTabButton.click();
  const gridDecompositionContent = page.getByText(
    "グリッド分解タブ Content (仮)"
  );
  await expect(gridDecompositionContent).toBeVisible();
  // Ensure GridTab content is no longer visible
  await expect(
    page.getByRole("heading", { name: "グリッドタブ" })
  ).not.toBeVisible();

  // Switch back to "グリッド" tab
  await gridTabButton.click();
  await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible();
  await expect(gridDecompositionContent).not.toBeVisible();

  // Final check for console errors/warnings accumulated during the test
  expect(messages.filter((type) => type === "error")).toHaveLength(0);
  expect(messages.filter((type) => type === "warning")).toHaveLength(0);

  console.log(
    "[Test Log] App structure and basic tab interaction test completed successfully."
  );
});
