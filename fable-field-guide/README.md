# fable-field-guide

[GreatMark/fable-field-guide-skills](https://github.com/GreatMark/fable-field-guide-skills)（Thariq「A Field Guide to Fable: Finding Your Unknowns」をコミュニティが8スキルに蒸留したもの）を試す実験。Issue [#14](https://github.com/x24ken/playground/issues/14)。

背景: Literature Note『How Boris Uses Claude Code』Vol 18。「地図（プロンプト）と領土（実コードベース）のギャップ＝unknowns。unknownsを減らし備えることがエージェンティックコーディングのスキルそのもの」（Thariq）。

## やったこと

### 1. インストール方式

plugin ではなくスキルコピー方式を採用。issueの「絞る」案どおり本命3スキルを `playground/.claude/skills/` にプロジェクトスコープで配置した：

- `blindspot-pass` — unknown unknowns の洗い出し（実装前・本命）
- `interview-me` — known unknowns を1問ずつ決定記録に変換（実装前）
- `change-quiz` — 変更のHTMLレポート＋満点を取るまでマージしないクイズ（実装後）

コピー直後からセッションのスキル一覧に認識された（プロジェクトスコープ試行はこれで成立）。スキル本体のcloneは `vendor/`（gitignore済み）。

追記: Cursorでも試すため同3スキルを `~/.cursor/skills/` にも配置。また折衷案として、**本文は英語のまま description に日本語トリガーのみ追記**した（「盲点を洗い出して」「インタビューして」「クイズして」等。upstream追従コストを抑えつつ日本語発話で発動させるため。原文の英語・中国語トリガーは残置）。

### 2. 比較実験：素のプロンプト vs スキル版 blindspot pass

被験タスク:「**Honoにレートリミットのビルトインミドルウェアを追加したいが内部を何も知らない**」（honojs/hono を履歴付きclone、読み取り専用）。同一タスクで2エージェントを並列実行し、さらにシンプルな題材で「捏造しない」ルールも検証した。

| | A: 素のプロンプト | B: SKILL.md指示付き | C: スキル版・シンプル題材（expect-cli） |
|---|---|---|---|
| ツール呼び出し | 20回（読了 約22ファイル） | 15回（約16ファイル） | 12回（約14ファイル） |
| トークン | 60.9k | 39.1k | 34.7k |
| 所要時間 | 232秒 | 140秒 | 82秒 |
| 最重要盲点への到達 | ✅ | ✅ | ✅（メタレベル） |
| 報告の4分類 | 自己流（ほぼ同構成） | ✅ 準拠 | ✅ 準拠 |
| 掃き残し（unswept corners）の明示 | あり（自発的） | ✅ 明示 | — |
| 出典（パス:行番号/commit） | あり | あり | あり |

**A・Bどちらも最重要盲点に到達した**：「実装の巧拙以前に、コアに入れる提案が通るか」——HonoのCONTRIBUTINGは外部依存・状態を持つ機能をコアに入れず `@hono/*` サードパーティに回す方針で、AI生成PRは無警告クローズの対象。両者とも `getConnInfo` 注入慣習、Store設計（原子的increment）、exports配線4点セット、RateLimitヘッダ標準にも到達。

差が出たのは**コストと規律**：

- Bは探索キャップ（15-25）の下限強で止まり、Aより **約35%安く・40%速く** ほぼ同等の「アプローチを変える発見」を出した
- Aはキャップがない分深掘りし、Cloudflare Workersの `Date.now()` タイミング攻撃対策や `validate-exports.ts` CI など追加ディテールを拾った（コスト増と引き換え）
- Bは掃き残し領域を義務として明示。報告の再現性・信頼性はスキル版が上

**C（正直さテスト）**：expect-cliのコードは「シンプル」と明言して捏造せず、盲点は「実験の位置づけ・外部ツールの既知バグ・skill検証ワークフロー」というメタレベルに正しく切り分けた。「`npx expect-cli init` 再実行でgit rootが汚染される」という本物の地雷もREADMEから拾った。「シンプルならシンプルと言う」ルールは機能する。

### 実験の注意点（クリーンでない部分）

- Aの実行環境にもプロジェクトのスキル一覧（description）が見えていたため、Aが最後に「interview-me推奨」と書いた点はスキルの存在に汚染されている。発見の中身自体はコードベース調査由来なので比較の主旨には影響薄
- n=1 の比較。モデルはFable 5同士

## 所感

- **Fable 5では素のプロンプトでも発見の質はほぼスキル版に並ぶ**。Thariqの「テクニック自体」が本体で、スキルはそれを安く・速く・再現性高くするパッケージング
- スキルの価値は探索キャップ（コスト制御）と報告契約（4分類・掃き残し明示・捏造禁止）。無人実行・サブエージェント化するときに特に効く
- blindspot pass → 「残る分岐はあなたにしか決められない → interview-me へ」というスキルチェーンの誘導は自然に機能した

## blindspot道場（Cursorでの体験用）

「未知のコードベース」を体験するために、**盲点を14個仕込んだ架空のコードベース** `dojo/`（カフェのポイントカードAPI、独立git履歴付き・gitignore済み）を用意した。出題は「**クーポン機能を追加したい**」——過去に一度実装されrevertされた履歴（理由: タイムゾーンバグ）が最重要の地雷。

- 遊び方と答え合わせ: [`DOJO-ANSWERS.md`](./DOJO-ANSWERS.md)（**実行前に見ない**。dojo/の外にあるのでエージェントからは見えない）
- Cursorで `dojo/` をrootにして開き、「このAPIにクーポン機能を追加したいが何も知らない。盲点を洗い出して」

### 実施結果（2026-08-13、Claude Code + ~/.claude/skills のスキル版）

**11/14直撃＋2部分＋見逃し1**で合格級。最重要のrevert履歴は「新機能ではなく事故機能の再実装が本当のタスク」というフレーミングで完璧に発見。見逃した#6（ランク改定のマーケ承認）はクーポン非直撃であり「トリビアは省く」ルール通りの取捨。さらに**答え合わせ表に無い盲点を3つ自力発見**した（旧実装がルート未配線のままrevertされた事実／退会会員がクーポンを使える穴／todayJstとtoUtcDateStringの日付ズレ）。仕込んだ盲点の「検出」を超えて、盲点同士を突き合わせた推論が働いている。

## 全9スキル＋フックの導入（2026-08-14）

残り6スキル（field-guide / design-directions / reference-hunt / implementation-plan / implementation-notes / pitch-explainer）も日本語トリガーを追記して `~/.claude/skills/` と `~/.cursor/skills/` に配置し、**全9スキルがグローバルで有効**になった。

さらに元リポジトリのフック2種を [`hooks/`](./hooks/) に用意（trigger-sentinel は日本語フレーズ対応済み・動作確認済み）：

- `trigger-sentinel.sh` — UserPromptSubmit。トリガーフレーズ検知で該当スキルの使用を1行注入（発動の決定論化）
- `merge-gate.sh` — PreToolUse(Bash)。`git merge` 検知でクイズ未合格を注意喚起（オプトイン: `FABLE_MERGE_GATE=1` か `.claude/fable-merge-gate`）

インストール（スクリプト設置は権限上ユーザーが実行する）：

```bash
mkdir -p ~/.claude/hooks/fable-field-guide && cp ~/playground/fable-field-guide/hooks/*.sh ~/.claude/hooks/fable-field-guide/ && chmod +x ~/.claude/hooks/fable-field-guide/*.sh
```

その後 `~/.claude/settings.json` の `hooks` に以下をマージ：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "matcher": "*", "hooks": [
        { "type": "command", "command": "$HOME/.claude/hooks/fable-field-guide/trigger-sentinel.sh", "timeout": 3 } ] }
    ],
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [
        { "type": "command", "command": "$HOME/.claude/hooks/fable-field-guide/merge-gate.sh", "timeout": 3 } ] }
    ]
  }
}
```

### チェーン通し試験（2026-08-13〜14、dojoで完走）

**blindspot-pass → interview-me → 実装 → change-quiz → pitch-explainer の5連チェーンが機能した。**

- interview-me: 決定記録の型（選択—なぜ—代替案—依存）を遵守。revertコミットの注意3点を「交渉不可の技術制約」として決定と区別。blindspot passの発見（db.jsのトランザクションFIXME）が「クーポンとポイントは完全独立」という設計判断に直結
- 実装: revertの教訓3点をすべて反映（`jstEndOfDayMs()` によるUTCミリ秒比較、Idempotency-Key、`flags.coupons` ゲート付きリリース）。テスト5→13本
- change-quiz: 全問が「diffだけでは答えられない」相互作用型（事故の根本原因、冪等リトライ、規約7条との絡み、退会会員、フラグoff時の挙動）
- 生成物（interview-decisions.md / change-report.html / coupon-explainer.html）は3つとも `.git/info/exclude` に自動登録され、変更セットに混ざらない仕様が機能

### 2周目：implementation-plan → implementation-notes → 実装 → change-quiz（2026-08-16、dojoで完走）

出題は dojo に仕込んでおいた**誕生日ボーナス（TODO(#31)）**。#31は実在しないissue番号（トラッカー参照不能なTODOの再現）で、倍率・対象期間が「マーケ未確定」という未決定事項入り。

- **implementation-plan**: 「覆されやすい決定を先頭に」の構成が機能。当日/誕生月・倍率・履歴分離（監査7年保持を理由に別エントリ）・2/29生まれの平年02-28適用を決定事項としてチャットで個別確認してから承認。**テストケース一覧を計画段階で確定**させたため、テスト自体は実装後に書かれたのに「実装の写しテスト」化を回避できた（JST境界 UTC 14:59:59Z/15:00:00Z ペア等が計画由来で入った）
- **implementation-notes**: 逸脱1件を正しい型（計画では/発見/対応/理由）で記録。中身も本物——Node の `Date.parse` が実在しない日付（"02-30"等）を翌月に繰り上げて解釈しNaNを返さない罠を踏み、往復一致チェックに切り替えた記録
- **検証**: テスト13→20本、`TZ=UTC` / `TZ=America/New_York` でも全緑（revert事故 935f2e0 の教訓の定着を確認）
- **change-quiz**: 全7問が相互作用型（履歴分離の不可逆性、JST境界、2/29両パターン、フラグoff時のクーポン404との挙動差、0pt時のボーナス行抑止）。「実装→クイズ→コミット」の順で実施——原典の「満点までマージしない」は下限制約であり、早く通すほど手戻りが安い

planモードとの関係も整理できた: planモードは「書き込み禁止＋承認ゲート」の仕組み、implementation-planは「計画書の中身の規律（決定事項先頭・ファイルとして残す・チェーン接続）」でレイヤーが違い、併用が作者想定（スキルdescriptionに明記）。pitch-explainerがPR説明文でなく自己完結HTMLなのは、PRを開かない読者（マーケ等の承認者）とPRが存在しない仕事（原典例: 動画編集）を想定した設計。レビュアーが全員GitHub住民なら同じ構成でPR本文に書くのが正しいローカライズ。

## 次にやること（ユーザーの対話が必要）

- [ ] **チェーン通し試験**: 対話セッションで `blindspot-pass → interview-me → 実装 → change-quiz` を1タスク通す。例：
  > Honoのレートリミッタの件、blindspot passの結果を踏まえてinterview meして。答えがアーキテクチャを変える質問を優先で
- [ ] interview-me / change-quiz は対話が本体なので今回未検証（無人実行では成立しない設計になっている——これは正しい挙動）
- [ ] 気に入ったら `~/.claude/skills/` へグローバル化するか判断。残り5スキル（design-directions / reference-hunt / implementation-plan / implementation-notes / pitch-explainer / field-guide）を入れるかも判断

## 参考

- 元スレッド: https://threadnavigator.com/thread/2073100352921215386/
- スキル本体: https://github.com/GreatMark/fable-field-guide-skills
- Literature Note: `How Boris Uses Claude Code.md` Vol 18（Obsidian vault）
