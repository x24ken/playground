# Storybook MCP for React 検証

[Issue #9](https://github.com/x24ken/playground/issues/9) の検証。AIエージェントにUIを生成させると既存コンポーネントを知らず「スロップ」（一貫性のない自作部品）を生む。Storybook MCP はコンポーネントのメタデータ（stories / props / docs）をMCP経由でエージェントに渡し、既存コンポーネントの再利用を促す仕組み。

**スコープ:** 設計案1（基本セットアップ）＋ 設計案2（composition で2つのStorybookを統合）＝本命。

## 結論（TL;DR）

✅ **本命成功。** 2つの独立したStorybook（デザインシステム用・アプリ用）を composition（`refs`）で束ね、**アプリ側の単一MCPエンドポイント（`localhost:6006/mcp`）だけで両方のコンポーネントを参照できた。** デザインシステムを別エンドポイントとして個別登録する必要はない。

- `list-all-documentation` は `# Local` / `# Design System` のセクションに分けて全コンポーネントを列挙
- composition越しのコンポーネント詳細も `get-documentation` で取得可能（stories・コード例・props型・JSDocまで）
- import文も `import { Button } from "design-system"` の形で解決される

## 構成

```
storybook-mcp/
├── .mcp.json              # Claude Code 用 MCP 登録（app の単一エンドポイント）
├── design-system/         # デザインシステム用Storybook（port 6007）
│   └── src/components/     # Button / Card / Badge
└── app/                   # アプリ用Storybook（port 6006・addon-mcp + composition）
    ├── src/components/     # SearchBar / StatChip（アプリ固有）
    └── .storybook/main.ts  # refs で design-system を参照
```

- **Storybook 10.4.4** / **@storybook/addon-mcp 0.6.0** / Node 24+ 必須（検証は v25.5.0）
- Storybook 10.4 の `init` は **addon-mcp をデフォルトで自動設定**する（手動の `storybook add` は不要だった）

## 再現手順

```bash
# 1. デザインシステム用Storybookを先に起動（composition先の解決のため先に立てる）
cd design-system && npm install && npm run storybook   # → http://localhost:6007

# 2. アプリ用Storybookを起動（composition で design-system を取り込む）
cd ../app && npm install && npm run storybook           # → http://localhost:6006
#    起動ログに「Initializing composition with 1 remote Storybook(s) / Sources: local, design-system」

# 3. Claude Code から MCP を使う
#    storybook-mcp/ で claude を起動すれば .mcp.json が自動で読まれる
#    （手動登録するなら）
claude mcp add --transport http --scope project storybook http://localhost:6006/mcp
```

composition の設定は `app/.storybook/main.ts`:

```ts
refs: {
  'design-system': { title: 'Design System', url: 'http://localhost:6007' },
}
```

## MCP が提供するツール（addon-mcp 0.6.0）

| ツール | 用途 |
|---|---|
| `list-all-documentation` | 全コンポーネントの一覧（composition含む） |
| `get-documentation` | 指定コンポーネントの詳細（stories・props・コード例） |
| `get-documentation-for-story` | 特定storyのドキュメント |
| `get-storybook-story-instructions` | story作成の手順ガイド |
| `preview-stories` | storyのプレビューURL取得（チャットUI埋め込み用） |
| `run-story-tests` | コンポーネントテスト実行 |

## 検証ログ（実際の出力）

`list-all-documentation`（app エンドポイント `localhost:6006/mcp`）:

```
# Local
- SearchBar (app-searchbar): このアプリ固有の検索バー...
- StatChip (app-statchip): このアプリ固有のKPI表示チップ...

# Design System          ← composition 経由で取り込まれた
- Badge (designsystem-badge): デザインシステムのステータスバッジ...
- Button (designsystem-button): デザインシステムの基本ボタン...
- Card (designsystem-card): デザインシステムの汎用カード...
```

`get-documentation`（composition越しのButton）→ stories・props・JSDoc・import文まで完全取得。

## 再利用デモ（MCPで発見 → API取得 → 再利用してUI生成）

実際に「エージェントがMCPだけを根拠に既存コンポーネントを再利用する」流れを実演した成果が
`app/src/screens/DashboardHeader.tsx`。

1. `list-all-documentation` で既存コンポーネントを発見（Local 2 + Design System 3）
2. `get-documentation` で各コンポーネントの props・型・import文を取得（新規発明の代わりに既存APIを把握）
3. 取得したAPIだけを使って「ダッシュボードヘッダー画面」を組み立て：
   - **Card / Button / Badge** … design-system（`import { Button } from "design-system"`）
   - **SearchBar / StatChip** … app固有
4. Storybook（`App/DashboardHeader`）で表示確認 → 既存のデザインシステムCSSのまま正しく描画

新規にButtonやCardを発明せず、`variant` / `tone` / `delta` 等の正しいpropsで再利用できている点がポイント。

> 補足: composition は Storybook UI / MCP 上での統合であり、実コードの依存解決とは別物。
> このデモでは MCP が示す import 名 `"design-system"` を実ソースに解決するため、
> `design-system/src/index.ts`（公開エントリ）と `app/.storybook/main.ts` の `viteFinal` alias を追加している。

## ハマりポイント

1. **composition が有効だと `get-documentation` は `storybookId` が常に必須になる。**
   composition なしならローカルは `get-documentation({ id })` だけでよいが、`refs` を設定して
   composition が有効になると、ローカルも含めて `storybookId` の指定が要る：
   ローカルは `{ id, storybookId: 'local' }`、design-system は `{ id, storybookId: 'design-system' }`。
   この `storybookId` は `list-all-documentation` のセクション見出し（`id: local` / `id: design-system`）に対応する。

2. **`get-documentation` の引数キーは `componentId` ではなく `id`。**
   スキーマ違反時のエラーメッセージに正解（`id` / `storybookId`）が出るので、それを読めば解決できる。

3. **design-system を先に起動する。** composition の `refs` は起動中の remote Storybook を解決するため、
   app より先に design-system を立てておかないと取り込みに失敗する。

4. **MCPエンドポイントはSSE形式で応答する。** `curl` で叩くときは
   `-H "Accept: application/json, text/event-stream"` を付け、レスポンスの `data: ` 行をパースする。

## 未検証（今回のスコープ外）

- 設計案3: 再利用効果ベンチ（MCPあり/なしで同じUIを生成し再利用率を比較）
- 設計案4: ライブプレビューのチャットUI埋め込み挙動（`preview-stories` の実体験）
- Chromatic による認証付きリモートMCPホスティング（チーム共有・本番運用向け）
