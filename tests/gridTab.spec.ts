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

  test("should display GridTab elements", async ({ page }) => {
    // H2見出しの存在確認
    await expect(
      page.getByRole("heading", { name: "グリッドタブ" })
    ).toBeVisible();

    // 行数スライダー関連要素の存在確認 (getByLabelを使用)
    const rowsSlider = page.getByLabel("行数:");
    await expect(rowsSlider).toBeVisible(); // スライダー本体 (input)
    // ボタンはスライダー要素の親コンテナ内にあると仮定して特定
    const rowsSliderContainer = rowsSlider.locator(
      'xpath=ancestor::div[@class="slider-container"]'
    );
    await expect(
      rowsSliderContainer.locator(".slider-button-prev")
    ).toBeVisible(); // 減少ボタン
    await expect(
      rowsSliderContainer.locator(".slider-button-next")
    ).toBeVisible(); // 増加ボタン

    // 列数スライダー関連要素の存在確認 (getByLabelを使用)
    const colsSlider = page.getByLabel("列数:");
    await expect(colsSlider).toBeVisible(); // スライダー本体 (input)
    // ボタンはスライダー要素の親コンテナ内にあると仮定して特定
    const colsSliderContainer = colsSlider.locator(
      'xpath=ancestor::div[@class="slider-container"]'
    );
    await expect(
      colsSliderContainer.locator(".slider-button-prev")
    ).toBeVisible(); // 減少ボタン
    await expect(
      colsSliderContainer.locator(".slider-button-next")
    ).toBeVisible(); // 増加ボタン

    // グリッド表示エリアの存在確認 (仮のテキストで確認)
    await expect(page.getByText("グリッド表示エリア (ここに")).toBeVisible();

    // 結果表示エリアの存在確認 (テキストの一部で確認)
    await expect(page.getByText("式:")).toBeVisible();

    // --- デバッグログ ---
    const initialRows = await page.getByLabel("行数:").inputValue(); // getByLabelを使用
    const initialCols = await page.getByLabel("列数:").inputValue(); // getByLabelを使用
    console.log(`[Test Debug] Initial Rows Slider Value: ${initialRows}`);
    console.log(`[Test Debug] Initial Cols Slider Value: ${initialCols}`);
    // --------------------
  });

  // TODO: Step 6-1 の確認方法にある「作成したUIがdesign.mdに記述したUI改善の仕様(サイズ、padding、矢印ボタン)を満たしているかを確認する」テストを追加する
  // (共通コンポーネント側のテストでカバーされている場合は省略可)
});
