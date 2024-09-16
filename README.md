# PR Reviewer

PR Reviewerは、OpenAIのGPTモデルを使用して、コードの変更をレビューするCLIツールです。

## 機能

- コミット前の変更やステージングされた変更のレビュー
- デフォルトのマージ先ブランチの設定
- ブランチごとのマージ先の設定
- 通常モード（GPT-4o-mini）と詳細モード（GPT-4o）の切り替え

## インストール

1. リポジトリをクローンします：
   ```
   git clone https://github.com/your-username/pr-reviewer.git
   cd pr-reviewer
   ```

2. 依存関係をインストールします：
   ```
   npm install
   ```

3. ツールをビルドします：
   ```
   npm run build
   ```

4. グローバルにインストールします：
   ```
   npm install -g .
   ```

## 使用方法

### 初期設定

1. OpenAI APIトークンを設定します：
   ```
   my-reviewer --token YOUR_OPENAI_API_TOKEN
   ```

2. デフォルトのマージ先ブランチを設定します（オプション）：
   ```
   my-reviewer --default-dest main
   ```

### レビューの実行

- 現在のブランチの全ての変更をレビュー：
  ```
  my-reviewer
  ```

- ステージングされた変更のみをレビュー：
  ```
  my-reviewer -s
  ```

- 詳細なレビュー（GPT-4oを使用）：
  ```
  my-reviewer --with-4o
  ```

- 特定のブランチのマージ先を設定：
  ```
  my-reviewer --dest develop
  ```

## 開発

### プロジェクト構造

- `src/index.ts`: エントリーポイント、CLIの設定
- `src/reviewer.ts`: レビューロジックの実装
- `src/configManager.ts`: 設定の管理

### ビルドとテスト

- ビルド：
  ```
  npm run build
  ```

- テスト（テストを実装している場合）：
  ```
  npm test
  ```

### 新機能の追加

1. 適切なファイル（`index.ts`, `reviewer.ts`, `configManager.ts`）に機能を実装します。
2. `README.md`を更新して新機能の使用方法を記述します。
3. 変更をコミットし、プルリクエストを作成します。

## 注意事項

- このツールはOpenAI APIを使用するため、APIの利用料金が発生します。
- コードの機密性に注意してください。必要に応じて機密情報をフィルタリングしてください。
- 共有リポジトリでの使用時は、チームメンバーと協議の上で使用してください。

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 貢献

バグ報告や機能リクエストは、GitHubのIssueで受け付けています。プルリクエストも歓迎します。
