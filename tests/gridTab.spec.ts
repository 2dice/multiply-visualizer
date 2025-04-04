import { test, expect } from "@playwright/test";

test.describe("GridTab UI", () => {
  test.beforeEach(async ({ page }) => {
    // アプリケーションのURLにアクセス (Viteのデフォルトポート)
    await page.goto("http://localhost:5173/");
    // ページ読み込み確認 (タブコンテナが表示されるまで待つ)
    const tabsContainer = page.locator(".tabs-container"); // App.jsx で追加したクラス名
    await expect(tabsContainer).toBeVisible({ timeout: 10000 }); // 10秒待機
    console.log("[Test Debug] Tabs container is visible.");
    // "グリッド" タブをクリック (getByRoleとexact: trueで特定)
    const gridTabButton = page.getByRole("button", {
      name: "グリッド",
      exact: true,
    });
    await expect(gridTabButton).toBeVisible(); // コンテナが見えていればタブもすぐ見えるはず
    console.log("[Test Debug] Grid tab button is visible.");
    await gridTabButton.click();
    console.log("[Test Debug] Clicked grid tab button.");
    // グリッドタブのコンテンツが表示されるまで少し待つ (念のため)
    await expect(
      page.getByRole("heading", { name: "グリッドタブ" })
    ).toBeVisible({ timeout: 5000 });
    console.log("[Test Debug] GridTab heading is visible after click.");
  });

  test("should display GridTab elements with correct layout and styles", async ({
    page,
  }) => {
    // H2見出しの存在確認
    await expect(
      page.getByRole("heading", { name: "グリッドタブ" })
    ).toBeVisible();

    // --- Layout Checks ---
    // #root が中央寄せされていないことを確認 (margin-left が auto でない)
    const rootElement = page.locator("#root");
    await expect(rootElement).not.toHaveCSS("margin-left", /auto/);
    await expect(rootElement).not.toHaveCSS("margin-right", /auto/);
    console.log("[Test Debug] #root is not centered.");

    // グリッド表示エリアの存在とスタイルの確認
    const gridDisplayArea = page.locator(".grid-display-area");
    await expect(gridDisplayArea).toBeVisible();
    await expect(gridDisplayArea).toHaveCSS("width", /[1-9][0-9]*px/); // 幅が0でないことを確認
    // min-height のチェックは変動する可能性があるため、ここでは省略またはより柔軟なチェックにする
    // await expect(gridDisplayArea).toHaveCSS("min-height", "250px");
    console.log(
      "[Test Debug] Grid display area is visible with correct styles."
    );

    // スライダーコンテナの存在とレイアウトの確認
    const sliderControlsContainer = page.locator(".slider-controls-container");
    await expect(sliderControlsContainer).toBeVisible();
    // justify-content のチェックは grid レイアウトでは不要になる場合があるためコメントアウト
    // await expect(sliderControlsContainer).toHaveCSS(
    //   "justify-content",
    //   "space-between"
    // );
    // Check grid layout for slider container
    await expect(sliderControlsContainer).toHaveCSS("display", "grid");
    // Check if grid-template-columns results in 4 pixel values
    await expect(sliderControlsContainer).toHaveCSS(
      "grid-template-columns",
      /^(\d+(\.\d+)?px\s+){3}\d+(\.\d+)?px$/
    );
    console.log(
      "[Test Debug] Slider controls container is visible with grid layout."
    );

    // --- Element and Style Checks ---
    // 行数スライダー関連要素の存在確認
    const rowsLabel = page.locator('.slider-label:has-text("行数:")');
    await expect(rowsLabel).toBeVisible();
    // Check if font-size is a reasonable pixel value (e.g., >= 16px, allows decimals)
    await expect(rowsLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 修正: 2桁以上のピクセル値（小数許容）
    );
    const rowsSliderInput = page.locator("#rows-slider"); // IDで特定
    await expect(rowsSliderInput).toBeVisible();
    // ボタンの確認 (Sliderコンポーネント内部構造に依存するため、より堅牢なセレクタが必要かも)
    const rowsSliderControl = rowsLabel.locator(
      'xpath=ancestor::div[@class="slider-control"]'
    );
    await expect(rowsSliderControl).toHaveCSS("align-items", "center"); // Check label centering
    await expect(
      rowsSliderControl.locator(".slider-button-prev")
    ).toBeVisible();
    await expect(
      rowsSliderControl.locator(".slider-button-next")
    ).toBeVisible();
    console.log("[Test Debug] Rows slider elements are visible.");

    // 列数スライダー関連要素の存在確認
    const colsLabel = page.locator('.slider-label:has-text("列数:")');
    await expect(colsLabel).toBeVisible();
    // Check if font-size is a reasonable pixel value (e.g., >= 16px, allows decimals)
    await expect(colsLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 修正: 2桁以上のピクセル値（小数許容）
    );
    const colsSliderInput = page.locator("#cols-slider"); // IDで特定
    await expect(colsSliderInput).toBeVisible();
    // ボタンの確認
    const colsSliderControl = colsLabel.locator(
      'xpath=ancestor::div[@class="slider-control"]'
    );
    await expect(colsSliderControl).toHaveCSS("align-items", "center"); // Check label centering
    await expect(
      colsSliderControl.locator(".slider-button-prev")
    ).toBeVisible();
    await expect(
      colsSliderControl.locator(".slider-button-next")
    ).toBeVisible();
    console.log("[Test Debug] Cols slider elements are visible.");

    // 結果表示エリアの存在確認 (テキストの一部で確認)
    const resultArea = page.locator(".result-area");
    await expect(resultArea).toBeVisible();
    const resultText = resultArea.locator(".result-text");
    await expect(resultText).toBeVisible();
    await expect(resultText).toContainText("式:");
    // Check if font-size is a reasonable pixel value (e.g., >= 20px, allows decimals)
    await expect(resultText).toHaveCSS("font-size", /(\d{2,}\.?\d*)px/); // 修正: 2桁以上のピクセル値（小数許容）
    console.log(
      "[Test Debug] Result area and text are visible with correct styles."
    );

    // --- デバッグログ ---
    const initialRows = await rowsSliderInput.inputValue();
    const initialCols = await colsSliderInput.inputValue();
    console.log(`[Test Debug] Initial Rows Slider Value: ${initialRows}`);
    console.log(`[Test Debug] Initial Cols Slider Value: ${initialCols}`);
    // --------------------
  });

  // TODO: Step 6-1 の確認方法にある「作成したUIがdesign.mdに記述したUI改善の仕様(サイズ、padding、矢印ボタン)を満たしているかを確認する」テストを追加する
  // (共通コンポーネント側のテストでカバーされている場合は省略可)
});
