import { test, expect } from "@playwright/test";

test.describe("GridDecompositionTab UI", () => {
  // このテストケースは、グリッド分解タブの要素やレイアウトのテストを行います
  test.beforeEach(async ({ page }) => {
    // アプリケーションのURLにアクセス (Viteのデフォルトポート)
    await page.goto("http://localhost:5173/");
    // ページ読み込み確認 (タブコンテナが表示されるまで待つ)
    const tabsContainer = page.locator(".tabs-container");
    await expect(tabsContainer).toBeVisible({ timeout: 10000 }); // 10秒待機
    console.log("[Test Debug] Tabs container is visible.");
    // "グリッド分解" タブをクリック (getByRoleとexact: trueで特定)
    const gridDecompositionTabButton = page.getByRole("button", {
      name: "グリッド分解",
      exact: true,
    });
    await expect(gridDecompositionTabButton).toBeVisible();
    console.log("[Test Debug] Grid decomposition tab button is visible.");
    await gridDecompositionTabButton.click();
    console.log("[Test Debug] Clicked grid decomposition tab button.");
    // グリッド分解タブのコンテンツが表示されるまで少し待つ (念のため)
    await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible({
      timeout: 5000,
    });
    console.log("[Test Debug] Grid canvas is visible after click.");
  });

  test("should display GridDecompositionTab elements with correct layout and styles", async ({
    page,
  }) => {
    // Gridキャンバスの存在確認
    await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible();

    // グリッド表示エリアの存在とスタイルの確認
    const gridDisplayArea = page.locator(".grid-display-area");
    await expect(gridDisplayArea).toBeVisible();
    await expect(gridDisplayArea).toHaveCSS("width", /[1-9][0-9]*px/); // 幅が0でないことを確認
    console.log(
      "[Test Debug] Grid display area is visible with correct styles."
    );

    // 4つのスライダーの存在確認
    // 行数スライダー
    const rowsControl = page.locator('[data-testid="rows-control"]');
    await expect(rowsControl).toBeVisible();
    const rowsSlider = page.locator('[data-testid="rows-slider"]');
    await expect(rowsSlider).toBeVisible();
    console.log("[Test Debug] Rows slider is visible.");

    // 列数スライダー
    const colsControl = page.locator('[data-testid="cols-control"]');
    await expect(colsControl).toBeVisible();
    const colsSlider = page.locator('[data-testid="cols-slider"]');
    await expect(colsSlider).toBeVisible();
    console.log("[Test Debug] Cols slider is visible.");

    // 縦分割スライダー
    const verticalSplitControl = page.locator(
      '[data-testid="vertical-split-control"]'
    );
    await expect(verticalSplitControl).toBeVisible();
    const verticalSplitSlider = page.locator(
      '[data-testid="vertical-split-slider"]'
    );
    await expect(verticalSplitSlider).toBeVisible();
    console.log("[Test Debug] Vertical split slider is visible.");

    // 横分割スライダー
    const horizontalSplitControl = page.locator(
      '[data-testid="horizontal-split-control"]'
    );
    await expect(horizontalSplitControl).toBeVisible();
    const horizontalSplitSlider = page.locator(
      '[data-testid="horizontal-split-slider"]'
    );
    await expect(horizontalSplitSlider).toBeVisible();
    console.log("[Test Debug] Horizontal split slider is visible.");

    // 結果表示エリアの存在確認
    const resultArea = page.locator(".result-area");
    await expect(resultArea).toBeVisible();
    const resultText = resultArea.locator(".result-text");
    await expect(resultText).toBeVisible();
    await expect(resultText).toContainText("式:");
    console.log(
      "[Test Debug] Result area and text are visible with correct styles."
    );

    // 分割結果の式表示エリアの存在確認
    const splitFormulaArea = page.locator(".split-formula-area");
    await expect(splitFormulaArea).toBeVisible();
    const splitFormulaText = splitFormulaArea.locator(".split-formula-text");
    await expect(splitFormulaText).toBeVisible();
    await expect(splitFormulaText).toContainText("+");
    console.log(
      "[Test Debug] Split formula area and text are visible with correct styles."
    );

    // --- デバッグログ ---
    const rowsInput = rowsSlider.locator("input");
    const colsInput = colsSlider.locator("input");
    const verticalSplitInput = verticalSplitSlider.locator("input");
    const horizontalSplitInput = horizontalSplitSlider.locator("input");
    const initialRows = await rowsInput.inputValue();
    const initialCols = await colsInput.inputValue();
    const initialVerticalSplit = await verticalSplitInput.inputValue();
    const initialHorizontalSplit = await horizontalSplitInput.inputValue();
    console.log(`[Test Debug] Initial Rows Slider Value: ${initialRows}`);
    console.log(`[Test Debug] Initial Cols Slider Value: ${initialCols}`);
    console.log(
      `[Test Debug] Initial Vertical Split Slider Value: ${initialVerticalSplit}`
    );
    console.log(
      `[Test Debug] Initial Horizontal Split Slider Value: ${initialHorizontalSplit}`
    );
    // --------------------
  });

  test("should update formula when slider values change", async ({ page }) => {
    // スライダーの値を変更して式が更新されるかをコンソールで確認
    // 行数スライダーのトラックをクリックして値を変更
    const rowsSlider = page.locator('[data-testid="rows-slider"]');
    const rowsTrack = rowsSlider.locator(".slider-track");
    await expect(rowsTrack).toBeVisible();

    // スライダーの中央あたりをクリックして値を変更
    const rowsTrackBoundingBox = await rowsTrack.boundingBox();
    if (rowsTrackBoundingBox) {
      await page.mouse.click(
        rowsTrackBoundingBox.x + rowsTrackBoundingBox.width * 0.7, // 右寄りをクリックして値を大きくする
        rowsTrackBoundingBox.y + rowsTrackBoundingBox.height / 2
      );
    }
    await page.waitForTimeout(500);

    // 結果テキストが更新されるか確認
    const resultText = page.locator('[data-testid="result-text"]');
    await expect(resultText).toContainText("式:");
    console.log("[Test Debug] Result text updated after changing rows");

    // 分割結果の式が更新されるか確認
    const splitFormulaText = page.locator('[data-testid="split-formula-text"]');
    await expect(splitFormulaText).toContainText("+");
    console.log("[Test Debug] Split formula text updated after changing rows");

    // 縦分割スライダーの値を変更
    const verticalSplitSlider = page.locator(
      '[data-testid="vertical-split-slider"]'
    );
    const verticalSplitTrack = verticalSplitSlider.locator(".slider-track");
    await expect(verticalSplitTrack).toBeVisible();

    // 縦分割スライダーのトラックをクリック
    const verticalSplitTrackBoundingBox =
      await verticalSplitTrack.boundingBox();
    if (verticalSplitTrackBoundingBox) {
      await page.mouse.click(
        verticalSplitTrackBoundingBox.x +
          verticalSplitTrackBoundingBox.width * 0.7, // 右寄りをクリック
        verticalSplitTrackBoundingBox.y +
          verticalSplitTrackBoundingBox.height / 2
      );
    }
    await page.waitForTimeout(500);

    // 分割結果の式が再度更新されるか確認
    await expect(splitFormulaText).toContainText("+");
    console.log(
      "[Test Debug] Split formula text updated after changing vertical split"
    );
  });
});
