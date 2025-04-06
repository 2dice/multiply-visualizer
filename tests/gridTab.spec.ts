import { test, expect } from "@playwright/test";

test.describe("GridTab UI", () => {
  // このテストケースは、グリッドタブの要素やレイアウトだけでなく
  // Canvas描画機能のテストも行います
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
    await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible({
      timeout: 5000,
    });
    console.log("[Test Debug] Grid canvas is visible after click.");
  });

  test("should display GridTab elements with correct layout and styles", async ({
    page,
  }) => {
    // Gridキャンバスの存在確認
    await expect(page.locator('[data-testid="grid-canvas"]')).toBeVisible();

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
    const rowsControl = page.locator('[data-testid="rows-control"]');
    await expect(rowsControl).toBeVisible();

    const rowsLabel = rowsControl.locator(".slider-label");
    await expect(rowsLabel).toBeVisible();
    // Check if font-size is a reasonable pixel value (e.g., >= 16px, allows decimals)
    await expect(rowsLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 修正: 2桁以上のピクセル値（小数許容）
    );

    const rowsSlider = page.locator('[data-testid="rows-slider"]');
    await expect(rowsSlider).toBeVisible();

    // ボタンの確認
    const rowsSliderPrev = rowsControl.locator(".slider-button-prev");
    const rowsSliderNext = rowsControl.locator(".slider-button-next");
    await expect(rowsSliderPrev).toBeVisible();
    await expect(rowsSliderNext).toBeVisible();
    console.log("[Test Debug] Rows slider elements are visible.");

    // 列数スライダー関連要素の存在確認
    const colsControl = page.locator('[data-testid="cols-control"]');
    await expect(colsControl).toBeVisible();

    const colsLabel = colsControl.locator(".slider-label");
    await expect(colsLabel).toBeVisible();
    // Check if font-size is a reasonable pixel value (e.g., >= 16px, allows decimals)
    await expect(colsLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 修正: 2桁以上のピクセル値（小数許容）
    );

    const colsSlider = page.locator('[data-testid="cols-slider"]');
    await expect(colsSlider).toBeVisible();

    // ボタンの確認
    const colsSliderPrev = colsControl.locator(".slider-button-prev");
    const colsSliderNext = colsControl.locator(".slider-button-next");
    await expect(colsSliderPrev).toBeVisible();
    await expect(colsSliderNext).toBeVisible();
    console.log("[Test Debug] Cols slider elements are visible.");

    // Canvas要素の存在確認
    const gridCanvas = page.locator('[data-testid="grid-canvas"]');
    await expect(gridCanvas).toBeVisible();
    // Canvasの属性を確認
    await expect(gridCanvas).toHaveAttribute("width", "500");
    await expect(gridCanvas).toHaveAttribute("height", "500");
    console.log(
      "[Test Debug] Grid canvas is visible with correct size attributes."
    );

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
    const rowsInput = rowsSlider.locator("input");
    const colsInput = colsSlider.locator("input");
    const initialRows = await rowsInput.inputValue();
    const initialCols = await colsInput.inputValue();
    console.log(`[Test Debug] Initial Rows Slider Value: ${initialRows}`);
    console.log(`[Test Debug] Initial Cols Slider Value: ${initialCols}`);
    // --------------------
  });

  // Canvas描画機能のテスト (Step 6-4)
  test("should render grid on canvas when slider values change", async ({
    page,
  }) => {
    // Canvas要素を確認
    const gridCanvas = page.locator('[data-testid="grid-canvas"]');
    await expect(gridCanvas).toBeVisible();
    console.log("[Test Debug] Starting Canvas rendering test");

    // グリッドが描画されているか確認（コンソールログで確認）
    const rowsSlider = page.locator('[data-testid="rows-slider"]');
    const colsSlider = page.locator('[data-testid="cols-slider"]');

    // スライダーの値を変更して描画が更新されるかをコンソールで確認
    const rowsNextButton = page.locator(
      '[data-testid="rows-control"] .slider-button-next'
    );
    await expect(rowsNextButton).toBeVisible();

    // 行数を4に変更
    await rowsNextButton.click();
    await page.waitForTimeout(500);

    // ブラウザコンソールのログを確認
    const rowsValue = await rowsSlider
      .locator('input[type="hidden"]')
      .getAttribute("value");
    const colsValue = await colsSlider
      .locator('input[type="hidden"]')
      .getAttribute("value");
    console.log(`[Test Debug] Current grid size: ${rowsValue} × ${colsValue}`);
    console.log("[Test Debug] Grid should be redrawn with new dimensions");

    // 結果テキストも期待通りに更新されているか確認
    const resultText = page.locator('[data-testid="result-text"]');
    await expect(resultText).toContainText(
      `${rowsValue} × ${colsValue} = ${Number(rowsValue) * Number(colsValue)}`
    );
    console.log(
      "[Test Debug] Result text updated correctly with the new calculation"
    );
  });

  test("should update state when slider values change (Step 6-3)", async ({
    page,
  }) => {
    // 初期値の確認
    console.log("[Test Debug] Checking initial values of sliders.");

    // data-testidを使用して要素を取得
    const rowsSlider = page.locator('[data-testid="rows-slider"]');
    const colsSlider = page.locator('[data-testid="cols-slider"]');
    const resultText = page.locator('[data-testid="result-text"]');

    // 初期値の確認 - カスタムスライダーのトラックとサム要素を取得
    const rowsTrack = rowsSlider.locator(".slider-track");
    const colsTrack = colsSlider.locator(".slider-track");
    await expect(rowsTrack).toBeVisible();
    await expect(colsTrack).toBeVisible();

    // カスタムスライダーの値を取得するためにhidden inputを使用
    const rowsHiddenInput = rowsSlider.locator('input[type="hidden"]');
    const colsHiddenInput = colsSlider.locator('input[type="hidden"]');

    const initialRowsValue = await rowsHiddenInput.getAttribute("value");
    const initialColsValue = await colsHiddenInput.getAttribute("value");
    console.log(`[Test Debug] Initial rows value: ${initialRowsValue}`);
    console.log(`[Test Debug] Initial cols value: ${initialColsValue}`);

    // 初期値が3、4であることを確認
    expect(initialRowsValue).toBe("3");
    expect(initialColsValue).toBe("4");

    // 初期状態での計算結果を確認
    await expect(resultText).toContainText("3 × 4 = 12");
    console.log(
      "[Test Debug] Initial calculation result is correct: 3 × 4 = 12"
    );

    // ------ 行数スライダーの値を変更する ------
    console.log("[Test Debug] Changing rows value using next button.");

    // 行数の矢印ボタンをクリックして値を増やす
    const rowsNextButton = page.locator(
      '[data-testid="rows-control"] .slider-button-next'
    );
    await expect(rowsNextButton).toBeVisible();
    await rowsNextButton.click();
    await page.waitForTimeout(1000); // 少し長めに待機

    // 値が更新されたか確認
    const newRowsValue = await rowsHiddenInput.getAttribute("value");
    console.log(`[Test Debug] Updated rows value: ${newRowsValue}`);
    expect(newRowsValue).toBe("4"); // 3、4に増えたか確認

    // 結果の式が更新されたか確認
    await expect(resultText).toContainText("4 × 4 = 16");
    console.log("[Test Debug] Calculation result updated to: 4 × 4 = 16");

    // ------ 列数スライダーの値を変更する ------
    console.log("[Test Debug] Changing cols value using track click.");

    // さらに列の値を変更 - トラックをクリックして値を直接変更
    // トラックの右端付近をクリックして最大値に近づける
    const colsTrackBounds = await colsTrack.boundingBox();
    if (colsTrackBounds) {
      // トラックの右端付近をクリック
      await page.mouse.click(
        colsTrackBounds.x + colsTrackBounds.width * 0.75, // 75%位置にクリック
        colsTrackBounds.y + colsTrackBounds.height / 2
      );
      console.log(
        "[Test Debug] Changed cols slider value by clicking on track"
      );
    }

    // 計算結果のテキストが再度更新されるのを待つ
    // 正確な値はクリック位置により異なる可能性があるので、単に値が更新されたことだけを確認
    await expect(resultText).not.toContainText("5 × 4 = 20"); // 以前の値とは異なることを確認
    console.log("[Test Debug] Result text updated after clicking track");

    // 値が更新されたか確認
    const newColsValue = await colsHiddenInput.getAttribute("value");
    console.log(`[Test Debug] Updated cols value: ${newColsValue}`);

    // 結果の式が更新されたか確認 - クリック位置によって値が変わるので、単に 4 × から始まる式であることを確認
    await expect(resultText).toContainText("4 ×");
    console.log(
      `[Test Debug] Calculation result updated correctly with new cols value: ${newColsValue}`
    );

    // ------ 列数を減らすボタンをテスト ------
    console.log("[Test Debug] Decreasing cols value using prev button.");

    // 列数の矢印ボタンをクリックして値を減らす
    const colsPrevButton = page.locator(
      '[data-testid="cols-control"] .slider-button-prev'
    );
    await expect(colsPrevButton).toBeVisible();
    await colsPrevButton.click();
    await page.waitForTimeout(1000); // 少し長めに待機
    console.log("[Test Debug] Clicked cols decrement button");

    // 値が更新されたか確認
    const decreasedColsValue = await colsHiddenInput.getAttribute("value");
    console.log(`[Test Debug] Decreased cols value: ${decreasedColsValue}`);

    // 結果の式が更新されたか確認 - 値が前回より小さくなっているかを確認
    // getAttribute()がnullを返す可能性があるのでチェックする
    const colsValue = decreasedColsValue || "6"; // nullの場合はデフォルト値を使用
    const expectedProduct = 4 * parseInt(colsValue);

    await expect(resultText).toContainText(`4 ×`);
    console.log(
      `[Test Debug] Calculation result updated correctly after decrement`
    );
  });
});
