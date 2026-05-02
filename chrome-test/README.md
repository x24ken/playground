# chrome-test: Claude Code × Chrome Extension 連携テスト

Claude Code (CLI) から Chrome Extension 経由でブラウザを操作し、UI検証を自律的に行えるかを試す最小実験。

## ファイル

- `index.html` — バグを意図的に仕込んだログインフォーム
- `serve.sh` — 開発サーバー起動（python3 http.server）
- `tmux-start.sh` — tmuxで2ペイン（dev server + claude --chrome）を一発起動

## 仕込んだバグ（Claude Codeが発見すべきもの）

ネタバレ注意。Claude Codeに先に発見させたい場合はここを読まずに試行。

<details>
<summary>クリックで展開</summary>

1. **メールバリデーション反転** — `@` を含まないと「正しいメールを入れて」と弾かれ、含むと通る
2. **パスワード長チェック未実装** — 8文字未満でも通過してしまう（コメントだけ残してロジックなし）
3. **submitでページリロード** — `event.preventDefault()` 忘れにより、フォーム送信時にページが再読込される

</details>

## 試し方

### 推奨: tmuxで一発起動

```bash
~/playground/chrome-test/tmux-start.sh
```

左ペインに開発サーバー、右ペインに `claude --chrome` が起動した状態で attach する。
既にセッションがあればそのまま attach（重複起動しない）。

### 手動: ターミナル2枚を別々に開く場合

ターミナル A — 開発サーバー起動:
```bash
cd ~/playground/chrome-test
./serve.sh
```

ターミナル B — Claude Code を Chrome連携で起動:
```bash
cd ~/playground/chrome-test
claude --chrome
```

### Claudeに以下を依頼

```
http://localhost:8000 を開いて、ログインフォームのバリデーションをテストしてください。
複数の入力パターン（正常/異常/境界値）を試して、想定どおりに動かない箇所をすべて報告してください。
```

### 期待される結果

Claude が自分でブラウザを操作し、3つのバグをすべて検出して報告する。
