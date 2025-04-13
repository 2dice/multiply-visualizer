import { test, expect } from "@playwright/test";

test.describe("TriangleAreaTab UI", () => {
  // このテストケースは、三角形タブの要素やレイアウトのテストを行います
  test.beforeEach(async ({ page }) => {
    // アプリケーションのURLにアクセス (Viteのデフォルトポート)
    await page.goto("http://localhost:5173/");
    // ページ読み込み確認 (タブコンテナが表示されるまで待つ)
    const tabsContainer = page.locator(".tabs-container"); // App.jsx で追加したクラス名
    await expect(tabsContainer).toBeVisible({ timeout: 10000 }); // 10秒待機
    console.log("[Test Debug] Tabs container is visible.");
    // "面積(三角形)" タブをクリック
    const triangleTabButton = page.getByRole("button", {
      name: "面積(三角形)",
      exact: true,
    });
    await expect(triangleTabButton).toBeVisible(); // コンテナが見えていればタブもすぐ見えるはず
    console.log("[Test Debug] Triangle tab button is visible.");
    await triangleTabButton.click();
    console.log("[Test Debug] Clicked triangle tab button.");
    // 三角形タブのコンテンツが表示されるまで少し待つ (念のため)
    await expect(page.locator('[data-testid="triangle-canvas"]')).toBeVisible({
      timeout: 5000,
    });
    console.log("[Test Debug] Triangle canvas is visible after click.");
  });

  test("should display TriangleAreaTab elements with correct layout and styles", async ({
    page,
  }) => {
    // 三角形キャンバスの存在確認
    await expect(page.locator('[data-testid="triangle-canvas"]')).toBeVisible();

    // 三角形表示エリアの存在とスタイルの確認
    const triangleDisplayArea = page.locator(".triangle-display-area");
    await expect(triangleDisplayArea).toBeVisible();
    await expect(triangleDisplayArea).toHaveCSS("width", /[1-9][0-9]*px/); // 幅が0でないことを確認
    console.log(
      "[Test Debug] Triangle display area is visible with correct styles."
    );

    // スライダーコンテナの存在とレイアウトの確認
    const sliderControlsContainer = page.locator(".slider-controls-container");
    await expect(sliderControlsContainer).toBeVisible();
    await expect(sliderControlsContainer).toHaveCSS("display", "grid");
    console.log(
      "[Test Debug] Slider controls container is visible with grid layout."
    );

    // 底辺スライダー関連要素の存在確認
    const baseControl = page.locator('[data-testid="base-control"]');
    await expect(baseControl).toBeVisible();

    const baseLabel = baseControl.locator(".slider-label");
    await expect(baseLabel).toBeVisible();
    await expect(baseLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 2桁以上のピクセル値（小数許容）
    );

    const baseSlider = page.locator('[data-testid="base-slider"]');
    await expect(baseSlider).toBeVisible();

    // ボタンの確認
    const baseSliderPrev = baseControl.locator(".slider-button-prev");
    const baseSliderNext = baseControl.locator(".slider-button-next");
    await expect(baseSliderPrev).toBeVisible();
    await expect(baseSliderNext).toBeVisible();
    console.log("[Test Debug] Base slider elements are visible.");

    // 高さスライダー関連要素の存在確認
    const heightControl = page.locator('[data-testid="height-control"]');
    await expect(heightControl).toBeVisible();

    const heightLabel = heightControl.locator(".slider-label");
    await expect(heightLabel).toBeVisible();
    await expect(heightLabel).toHaveCSS(
      "font-size",
      /(\d{2,}\.?\d*)px/ // 2桁以上のピクセル値（小数許容）
    );

    const heightSlider = page.locator('[data-testid="height-slider"]');
    await expect(heightSlider).toBeVisible();

    // ボタンの確認
    const heightSliderPrev = heightControl.locator(".slider-button-prev");
    const heightSliderNext = heightControl.locator(".slider-button-next");
    await expect(heightSliderPrev).toBeVisible();
    await expect(heightSliderNext).toBeVisible();
    console.log("[Test Debug] Height slider elements are visible.");

    // ラジオボタンの確認
    const vertexPositionControls = page.locator(
      '[data-testid="vertex-position-controls"]'
    );
    await expect(vertexPositionControls).toBeVisible();

    // 3つのラジオボタンの存在確認
    const leftRadio = page.locator('[data-testid="vertex-position-left"]');
    const centerRadio = page.locator('[data-testid="vertex-position-center"]');
    const rightRadio = page.locator('[data-testid="vertex-position-right"]');

    await expect(leftRadio).toBeVisible();
    await expect(centerRadio).toBeVisible();
    await expect(rightRadio).toBeVisible();

    // 中央ボタンが最初に選択されていることを確認
    await expect(centerRadio).toBeChecked();
    console.log(
      "[Test Debug] Radio buttons are visible and center is checked."
    );

    // Canvas要素の存在確認
    const triangleCanvas = page.locator('[data-testid="triangle-canvas"]');
    await expect(triangleCanvas).toBeVisible();
    // Canvasの属性を確認
    await expect(triangleCanvas).toHaveAttribute("width", "500");
    await expect(triangleCanvas).toHaveAttribute("height", "500");
    console.log(
      "[Test Debug] Triangle canvas is visible with correct size attributes."
    );

    // 結果表示エリアの存在確認
    const resultArea = page.locator(".result-area");
    await expect(resultArea).toBeVisible();
    const resultText = resultArea.locator(".result-text");
    await expect(resultText).toBeVisible();
    await expect(resultText).toContainText("面積:");
    await expect(resultText).toHaveCSS("font-size", /(\d{2,}\.?\d*)px/);
    console.log(
      "[Test Debug] Result area and text are visible with correct styles."
    );

    // スライダー値のデバッグログ
    const baseInput = baseSlider.locator("input");
    const heightInput = heightSlider.locator("input");
    const initialBase = await baseInput.inputValue();
    const initialHeight = await heightInput.inputValue();
    console.log(`[Test Debug] Initial Base Slider Value: ${initialBase}`);
    console.log(`[Test Debug] Initial Height Slider Value: ${initialHeight}`);
  });

  test("should update state when slider and radio button values change", async ({
    page,
  }) => {
    // 初期値の確認
    console.log(
      "[Test Debug] Checking initial values of sliders and radio buttons."
    );

    // スライダー要素を取得
    const baseSlider = page.locator('[data-testid="base-slider"]');
    const heightSlider = page.locator('[data-testid="height-slider"]');
    const resultText = page.locator('[data-testid="result-text"]');

    // ラジオボタン要素を取得
    const leftRadio = page.locator('[data-testid="vertex-position-left"]');
    const centerRadio = page.locator('[data-testid="vertex-position-center"]');
    const rightRadio = page.locator('[data-testid="vertex-position-right"]');

    // 底辺スライダーの値を変更
    const baseNextButton = page.locator(
      '[data-testid="base-control"] .slider-button-next'
    );
    await expect(baseNextButton).toBeVisible();
    await baseNextButton.click();
    await page.waitForTimeout(500);

    // 高さスライダーの値を変更
    const heightNextButton = page.locator(
      '[data-testid="height-control"] .slider-button-next'
    );
    await expect(heightNextButton).toBeVisible();
    await heightNextButton.click();
    await page.waitForTimeout(500);

    // 更新された値を確認
    const baseValue = await baseSlider
      .locator('input[type="hidden"]')
      .getAttribute("value");
    const heightValue = await heightSlider
      .locator('input[type="hidden"]')
      .getAttribute("value");
    console.log(
      `[Test Debug] Current triangle dimensions: base ${baseValue}, height ${heightValue}`
    );

    // 結果テキストの確認
    await expect(resultText).toContainText(`${baseValue} × ${heightValue}`);
    console.log(
      "[Test Debug] Result text updated correctly with the new calculation"
    );

    // ラジオボタンの値を変更（左端に変更）
    await leftRadio.click();
    await page.waitForTimeout(500);
    await expect(leftRadio).toBeChecked();
    console.log(
      "[Test Debug] Left vertex position radio button is now checked"
    );

    // ラジオボタンの値を変更（右端に変更）
    await rightRadio.click();
    await page.waitForTimeout(500);
    await expect(rightRadio).toBeChecked();
    console.log(
      "[Test Debug] Right vertex position radio button is now checked"
    );
  });
});
