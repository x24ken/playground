#!/bin/sh
# Fable Field Guide — trigger sentinel (UserPromptSubmit hook)
#
# Scans the user prompt for high-precision trigger phrases and injects a
# one-line reminder so the matching skill fires deterministically, even when
# many skills are installed. Works in Claude Code and Codex. No match -> no
# output, zero token overhead.
# Fail-open: any error exits 0 and never blocks the session.

# Scan at most the first 64 KB: trigger phrases appear at the start of a
# prompt in practice, and this keeps worst-case latency far below the 3s
# hook timeout even for huge pasted prompts.
INPUT=$(head -c 65536 2>/dev/null) || exit 0
[ -n "$INPUT" ] || exit 0

# Echo-loop guard: skip if the prompt already contains our marker
# (e.g. the user pasted a previous reminder back in).
case "$INPUT" in *"[FIELD GUIDE]"*) exit 0 ;; esac

# Note: we deliberately match against the whole hook payload, not just the
# parsed "prompt" field — dependency-free, robust to payload schema changes;
# the rare false positive (a trigger phrase inside e.g. a cwd path) only
# costs one advisory line.
# ASCII-only lowercasing; UTF-8 multibyte sequences pass through untouched.
lower=$(printf '%s' "$INPUT" | LC_ALL=C tr 'A-Z' 'a-z') || exit 0

matches=""
check() {
  # $1 = trigger phrase (lowercase), $2 = skill name
  case "$lower" in
    *"$1"*)
      case " $matches " in
        *" $2 "*) ;;
        *) matches="$matches $2" ;;
      esac
      ;;
  esac
}

check "field guide" "field-guide"
check "该用哪个 skill" "field-guide"
check "这套流程怎么用" "field-guide"
check "装了哪些技能" "field-guide"
check "blindspot pass" "blindspot-pass"
check "盲区扫描" "blindspot-pass"
check "unknown unknowns" "blindspot-pass"
check "我刚接手这块代码" "blindspot-pass"
check "帮我看看有什么坑" "blindspot-pass"
check "interview me" "interview-me"
check "访谈我" "interview-me"
check "design directions" "design-directions"
check "出几个设计方向" "design-directions"
check "出几版 ui" "design-directions"
check "哪种页面风格好" "design-directions"
check "reference hunt" "reference-hunt"
check "参考狩猎" "reference-hunt"
check "照着这个实现" "reference-hunt"
check "find me a reference" "reference-hunt"
check "implementation plan" "implementation-plan"
check "实现计划" "implementation-plan"
check "写个实现方案" "implementation-plan"
check "落地方案" "implementation-plan"
check "implementation notes" "implementation-notes"
check "实现笔记" "implementation-notes"
check "pitch doc" "pitch-explainer"
check "explainer" "pitch-explainer"
check "提案文档" "pitch-explainer"
check "打包给评审" "pitch-explainer"
check "汇报材料" "pitch-explainer"
check "评审材料" "pitch-explainer"
check "change quiz" "change-quiz"
check "quiz me" "change-quiz"
check "考考我" "change-quiz"
check "变更测验" "change-quiz"

# 日本語トリガー（fable-field-guide 実験 #14 で追記。SKILL.md descriptionの
# 日本語フレーズと同期させること）
check "フィールドガイド" "field-guide"
check "どのスキルを使えばいい" "field-guide"
check "盲点パス" "blindspot-pass"
check "盲点を洗い出して" "blindspot-pass"
check "落とし穴を教えて" "blindspot-pass"
check "地雷がないか見て" "blindspot-pass"
check "インタビューして" "interview-me"
check "要件を1問ずつ聞いて" "interview-me"
check "曖昧な点を質問して" "interview-me"
check "デザイン案を何個か見せて" "design-directions"
check "違う方向性で何案か出して" "design-directions"
check "この挙動を移植して" "reference-hunt"
check "を参考に実装して" "reference-hunt"
check "実装計画を書いて" "implementation-plan"
check "実装ノートを残して" "implementation-notes"
check "逸脱を記録しながら進めて" "implementation-notes"
check "ピッチ資料" "pitch-explainer"
check "変更クイズ" "change-quiz"
check "理解度クイズ" "change-quiz"

[ -n "$matches" ] || exit 0
matches=${matches# }

# Invariant: the format string below must never contain user data — only
# $matches (a closed set of hardcoded skill names) is interpolated.
printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"[FIELD GUIDE] Trigger phrase detected. Before responding, load and follow the matching installed skill(s): %s"}}\n' "$matches"
exit 0
