# TODOリスト

## Step 8-3: Canvasによる描画処理 (done)

- [x] プロジェクトの現在の状態を確認
  - [x] 現在のTriangleAreaTab.jsxのCanvas描画部分を確認
  - [x] ESLint警告「React Hook useCallback has unnecessary dependencies: 'base', 'height', and 'vertexPosition'」の確認
- [x] Canvas描画機能の実装
  - [x] drawTriangle関数の依存配列問題を修正
  - [x] スライダーの値(底辺・高さ)に応じた三角形描画処理
  - [x] 頂点位置(左端・中央・右端)に応じた三角形描画処理
  - [x] 空白部分の色付き点滅表示機能の実装
    - [x] 正三角形の場合(頂点位置中央)の処理
    - [x] 直角三角形の場合(頂点位置左端・右端)の処理
- [x] レイアウト調整
  - [x] 三角形の左下をグリッドエリアの左下に固定
  - [x] 座標計算の最適化
- [x] 描画最適化
  - [x] 点滅機能の実装
  - [x] 状態変化に応じた再描画の実装

## 完了後の作業（ユーザーの許可を得てから実行）

- [x] ./RooDocs/log.mdに今回のステップでうまくいった手法と今後の留意点を追記
- [x] ./RooDocs/step.mdの該当ステップに(done)を追記
- [x] コミットメッセージの作成
