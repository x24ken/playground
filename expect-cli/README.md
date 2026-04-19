# expect-cli

[Expect](https://github.com/millionco/expect)（AIコーディングエージェント向けブラウザテストツール）を Vite + React アプリで試した実験。

Issue: [#1](https://github.com/x24ken/playground/issues/1)

## 構成

- Vite + React + TypeScript の最小アプリ
- Expect MCP（`expect-cli@0.1.3`）を Claude Code に接続
- Playwright + Chromium で実ブラウザテスト

## 試した結果

- ✅ Vite アプリのセットアップ → `http://localhost:5173/` で起動
- ✅ Claude Code から「Vite アプリをブラウザでテストして」と依頼 → expect skill が自動起動 → MCP 経由で Chromium を立ち上げてカウンターボタンの動作を確認・コンソールエラーなしを検証
- ✅ headed モード（既定）の動作確認
- ✅ headless モード: `.mcp.json` の `env.EXPECT_HEADED=false` で切り替え
- ❌ Cookie 抽出: 未成熟。Guest Profile を読みに行く・暗号化 Cookie の復号が不安定など、MCP モードでは実用的でない（upstream [#89](https://github.com/millionco/expect/issues/89), [#25](https://github.com/millionco/expect/issues/25) で認識済み）。代替として CDP モード（既存 Chrome に直接接続）が推奨されている
- ⚠️ ビデオ録画: 設定不要で `/tmp/expect-artifacts/` に自動録画される。ただしファイル名がエポックミリ秒やハッシュのみでテスト内容と紐付けできず実用性は低い。また ffmpeg がバックグラウンドで暴走するバグ報告あり（[#97](https://github.com/millionco/expect/issues/97), [#98](https://github.com/millionco/expect/issues/98)）

## 総評

**コンセプトは良いが実用にはまだ早い**（2026-04 時点、v0.1.3）。

- Star 3,379 / Fork 144（公開5週間）と注目度は高い
- 「AIエージェントに自然文でブラウザテストを依頼できる」体験は魅力的
- ただし init のバグ、Cookie抽出の未成熟、ffmpeg暴走、Playwright MCP との競合など、基本的なワークフローでもハマりポイントが多い
- 開発は活発（Issue対応は早い）なので、数ヶ月後に再評価する価値あり

## ハマったポイント

### 1. `expect-cli init` は git リポジトリのルートに書き込む

`expect-cli/` 配下で `npx expect-cli@latest init` を実行しても、設定ファイル（`.mcp.json`、`.agents/`、`.claude/skills/`、`.cursor/`、`.gemini/`、`.expect/`、`.vscode/`、`.github/copilot/`）は **git root（`~/playground/`）に作られる**。

playground のように1リポジトリで複数実験を管理している場合、ルートが汚染される。対策:

- ルートに `.gitignore` を置いて防衛（このリポジトリでは適用済み）
- 実験用 init 後はルートをクリーンアップ
- 重要な設定だけ `expect-cli/` 配下に手動で複製して使う

### 2. SKILL コピーが失敗する（v0.1.3 のバグ）

```
Claude Code: Failed to copy skill: copied skill is missing SKILL.md
```

CLI が `https://raw.githubusercontent.com/millionco/expect/main/SKILL.md` を取りに行くが 404。実体は `.agents/skills/expect/SKILL.md` にある。
upstream Issue [#77](https://github.com/millionco/expect/issues/77) 関連。

**回避策:** 該当ファイルを upstream main から手動で取得して `.claude/skills/expect/SKILL.md` に配置。

```bash
mkdir -p .claude/skills/expect
curl -sL https://raw.githubusercontent.com/millionco/expect/main/.agents/skills/expect/SKILL.md \
  -o .claude/skills/expect/SKILL.md
```

### 3. headless 切り替えは環境変数 `EXPECT_HEADED` で行う

`.expect/project-preferences.json` は CLI の Watch UI 用で、MCP サーバーは読まない。MCP の headless 制御は env var `EXPECT_HEADED=false` のみ。`.mcp.json` の `env` で渡す。

### 4. Playwright MCP が併存していると expect MCP がスキップされる

ユーザー設定に Playwright MCP がある状態だと、Claude が expect MCP ではなく Playwright MCP を直接呼ぶことがある（SKILL.md に「raw browser tools を使うな」と書いてあっても）。明示的に「expect MCP で」と指示するか、プロジェクト単位で他ブラウザ MCP を無効化する。

### 5. Cookie 抽出は Guest Profile を読みに行く

`EXPECT_COOKIE_BROWSERS=Chrome` を指定しても、Default プロファイルではなく Guest Profile の Cookie DB を読みに行くため cookie_count: 0 になる。`EXPECT_PROFILE=Default` を指定しても改善せず。認証済みテストには CDP モード（`EXPECT_CDP_URL`）で既存 Chrome に接続する方法が推奨。

### 6. MCP 設定の手動配置

CLI のフローでうまく書き込まれない場合は手動で `.mcp.json` を配置:

```json
{
  "mcpServers": {
    "expect": {
      "command": "npx",
      "args": ["-y", "expect-cli@0.1.3", "mcp"]
    }
  }
}
```

## 仕組み（最終構成）

```
Claude Code
  ├─ .claude/skills/expect/SKILL.md   ← Skill: いつ・どう使うかの指示書
  └─ .mcp.json                        ← MCP: ブラウザ操作ツールを提供
       └─ npx expect-cli mcp (子プロセス)
            └─ Playwright + Chromium → 実ブラウザ
```

- **Skill** がコード変更やテスト要求をトリガーに自動起動
- **MCP** が `expect-open`、`expect-screenshot`、`expect-playwright`、`expect-console_logs`、`expect-close` などのツールを提供
- 実ブラウザでのスクリーンショット + コンソールログを Claude にフィードバック

## 起動方法

```bash
cd ~/playground/expect-cli
npm install
npm run dev   # 別ターミナル
claude        # このディレクトリで起動
# → 自然文で「テストして」と依頼
```
