# 開発ログ

## Step 1 (2025/03/09)

### うまくいった手法

- `npm create vite@latest my-project -- --template react` コマンドで、Vite と React を使用したプロジェクトを正常に作成できた。
- `cd my-project && npm install && npm run dev` コマンドで、依存関係のインストールと開発サーバーの起動ができた。
- 開発サーバー起動後、ブラウザで `http://localhost:5173/` にアクセスし、初期ページが表示されることを確認できた。

### 今後の留意点

- 特になし。

## Step 2 (2025/03/09)

### うまくいった手法

- `vite.config.js` に `base: './'` と `build: { outDir: '../docs' }` を設定することで、GitHub Pages での公開に成功した。
- `package.json` に `"homepage": "https://2dice.github.io/multiply-visualizer/"` を追加することで、GitHub Pages での公開に対応できた。
- `cd my-project && npm run build && cd .. && git add docs && git commit -m "Deploy to GitHub Pages with docs folder" && git push origin main` コマンドで、`docs` ディレクトリをGitHub Pages にデプロイできた。

### 今後の留意点

- `git add` するディレクトリを間違えないように注意する。

## Step 3 (2025/03/09)

### うまくいった手法

- `cd my-project && npm install --save-dev eslint prettier eslint-plugin-react eslint-config-prettier` コマンドで、ESLintとPrettier、関連パッケージをインストールできた。
- `.eslintrc.cjs` ファイルを作成し、ESLintの設定を記述できた。
- `.prettierrc.cjs` ファイルを作成し、Prettierの設定を記述できた。
- `package.json` に `lint` と `format` スクリプトを追加し、`build` スクリプトに `npm run lint && npm run format` を追加できた。
- `npm run lint` と `npm run format` コマンドが正常に実行できることを確認できた。

### 今後の留意点

- 特になし。

## Step 4 (2025/03/09)

### うまくいった手法

- `cd my-project && npm install -D playwright @playwright/test` コマンドで、Playwrightとテストフレームワークをインストールできた。
- `npx playwright install` コマンドで、必要なブラウザをインストールできた。
- `my-project/tests/example.spec.ts` ファイルを作成し、簡単なテストを記述できた。
- `cd my-project && npx playwright test` コマンドで、テストを実行し、成功することを確認できた。

### 今後の留意点

- コマンド実行時に`&amp;&amp;`ではなく`&&`を使用する。
- `npm run dev` はユーザーが実行し、`npx playwright test` はRooが実行する。

## Step 5 (2025/03/23)

### うまくいった手法

- `src/components/UI/`ディレクトリを作成し、`Tab.jsx`、`Slider.jsx`、`Button.jsx`を作成できた。
- `src/App.jsx`を修正し、作成したコンポーネントを表示できた。
- `tests/example.spec.ts`を修正し、コンソールエラーのチェック、UIコンポーネントの表示確認、基本的な操作のテストを追加できた。
- `npx playwright test`でテストが成功することを確認できた。
- `eslint.config.js`の`ignores`に`docs/assets/*`を追加することで、ビルドファイルのエラーを無視できた。
- `.eslintrc.cjs`が不要であることを確認し、削除できた。

### 今後の留意点

- 特になし。

## Step 5.1 (2025/03/23)

### うまくいった手法

- `design.md` の UI 改善の仕様に従い、`Slider.jsx` と `Button.jsx` を修正できた。
- `Slider.jsx` に、左右の矢印ボタンと、スタイル調整用の CSS を追加できた。
- `Button.jsx` に、スタイル調整用の CSS を追加できた。
- `App.jsx` を修正し、`Slider` コンポーネントに `onIncrease` と `onDecrease` の props を渡すように変更できた。
- `tests/example.spec.ts` を修正し、UI 改善後の `Slider` と `Button` の表示と動作を確認するテストを追加できた。
- `npx playwright test` でテストが成功することを確認できた (最終的には `toBeCloseTo` を使用して誤差を許容するように修正)。
- `Slider.css` に `box-sizing: border-box;` を追加し、padding を含めた幅で要素のサイズを計算するように修正した (結果的に `width` を `320px` に修正する必要があった)。
- `App.jsx` の重複 import 文を削除し、lint エラーを解消した。
- `Slider.jsx` にデバッグ用の表示を追加し、offsetWidth と clientWidth の値を確認することで、CSS が適用されていない原因を特定しようとした (最終的には CSS が適用されていたが、`box-sizing` の理解不足が原因と判明)。
- スライダーの値が 0 の位置で上矢印ボタンを押すと値が異常に増加していくバグを修正した。
- スライダーのボタンをテキストから SVG アイコンに変更し、スタイル (青地、白アイコン、丸み、影) を適用した。
- `tests/example.spec.ts` の `sliderButtonWidth` の期待値を `toBeCloseTo(40, 0)` から `toBeCloseTo(30, 0)` に修正した。

### 今後の留意点

- CSS のスタイリングはまだ仮のものなので、今後デザインに合わせて調整する必要がある。
- Slider の increase/decrease のテストで、初期値が 50 であることを前提にしているが、これは `App.jsx` の `useState` の初期値に依存しているので、変更があった場合にテストが失敗する可能性がある。初期値を props で渡すように変更するか、テスト内で初期値を設定するように変更することを検討する。
- `box-sizing: border-box;` の理解を深め、CSS の設計に活かす。
- Playwright のテストで、offsetWidth や clientWidth のような数値の比較を行う場合は、誤差を考慮して `toBeCloseTo` を使用することを検討する。
