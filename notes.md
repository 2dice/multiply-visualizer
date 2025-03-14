# 引き継ぎ資料 (notes.md)

## プロジェクト開始時の実行手順
*   ユーザーから提供された`spec.md`でアプリの仕様を確認する
*   `design.md`の作成
    * `spec.md`の内容を元に、どのような設計でどのようなコードを書くか計画を記載する。
    * `spec.md`の情報は省略せず、そのまま使える部分はそのまま使っても良いので抜け漏れがないこと。
    * その内容には機能要件・技術スタック・アーキテクチャ設計などを含む。
    * 機能要件を満たす場合の実際の表示UIやデータの状態も具体例とともに記載すること。
    * 具体的なコードやコマンドは書かないこと。
    * 以下の例を参考に作成する。
      @https://github.com/YuheiNakasaka/sprint-calendar/blob/main/README.md
      @https://github.com/karaage0703/docubot/blob/main/docs/design.md
*   `step.md`の作成
    * "design.md"のゴールに向けて実装計画を作成し記載する。
    * 各ステップはなるべく細かい粒度で設定し、段階的に拡張するように設定する。
    * 粒度の例：
      * step1: 主に環境構築を目的とし、最小限のページを開発環境で表示。
      * step2: githubと連携しgithub pagesでの表示確認。
      * step3: ESLintとPrettierの導入・動作確認・dev/buildコマンドへの組み込み。
      * step4: playwrightの導入とテスト実装。
    * step内で1つの機能を実装するとき、分割できそうならstep1-1,step1-2のように階層化しても良い。
    * 各ステップにはステップの簡単な概要と、実装が正しく動作したかを確認する方法を必ず記載すること。
    * デバッグはplaywright実行時にターミナルへ出力する情報を元に行うこと。
    * そのためにplaywrightを導入後のステップではどのようなテストを書くかの概要を記載すること。

## 各ステップの実行手順
*   ステップ開始時
    * `design.md`を参照し、プロジェクトの設計を把握すること。
    * `step.md`を参照し、現在の進行状況とこれから行うステップの内容を把握すること。
*   ステップ実行中
    * `npm run dev`実行前に、導入済みであればlint、formatter、テストを実行する。
    * テストはターミナルにデバッグログとして使える情報を出せるようなテストケースを作成する。
    * 同じアプローチが2回失敗したら別の方法を検討する。
*   ステップ終了時
    * `log.md`に、今回のステップで実際にうまくいった手法(手順)と今後の留意点を追記すること。
    * `design.md`の変更が必要になった場合は必要に応じて更新すること。
    * `step.md`の該当ステップに`(done)`を追記すること。
    * `step.md`の該当ステップの内容が実作業と異なる場合、必要に応じて更新すること。
    * `step.md`の次以降のステップの内容が、適切な粒度になっていることを確認し、必要に応じて修正すること。
    * `notes.md`を実際にステップを実行した経験を元に更新すること。
    * ステップの中で行ったgit commitを一つのcommitにまとめ、詳細なコミットメッセージを記載する。(ユーザーに詳細な方法とコミットメッセージを教えて依頼する)

## ユーザー特有の注意事項

*   指示が曖昧な場合や、複数の解釈が可能な場合があるため、不明点は確認すること。
*   ユーザーはコマンド実行ごとに新しいターミナルが立ち上がることを好まない。
*   JavaScrotp、GitHub Pagesの設定、Viteの挙動等について、詳細な知識を持っていない。
*   Playwrightを導入する目的は、ターミナル(PowerShell)のログをモデル(AI,LLM)が直接読み取って自律的にデバッグを進めるため。
*   `npm run dev`での結果だけでなく、`npm run build`した結果とGithub Pagesでの表示も確認する必要がある。

## 開発環境

*   Windows 10
*   PowerShell
*   npm
*   Git
*   GitHub
*   VSCode

## 開発環境特有の注意事項
*   ターミナルでのコマンド実行後、カーソル操作やエディタでの記入などの操作が必要な場合はユーザーに内容を指示すること。
*   開発者ツールのコンソールログやターミナルのログが読み取れない場合、ユーザーに具体的に指示して内容をコピーするよう指示すること。
*   コマンド実行時に`&amp;&amp;`ではなく`&&`を使用する。
*   `npm run dev` はユーザーに実行を依頼し、`npx playwright test` はRooが実行する。

## GitHub Pages デプロイに関する注意事項

*   ViteプロジェクトをGitHub Pagesにデプロイする際は、`vite.config.js`に`base`と`build.outDir`の設定が必要。
    *   `base`は、`./` (相対パス)に設定する。
    *   `build.outDir`は、`../docs`に設定する。
*   `package.json`に`homepage`プロパティを追加する。
    *   `"homepage": "https://<GitHubのユーザー名>.github.io/<リポジトリ名>/"`
*   GitHub Pagesの設定で、Sourceを`main`ブランチ、ディレクトリを`/docs`に設定する。
*   デプロイコマンドは、`cd my-project && npm run build && cd .. && git add docs && git commit -m "Deploy to GitHub Pages with docs folder" && git push origin main`
