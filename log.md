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