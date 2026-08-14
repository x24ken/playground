#!/bin/sh
# Fable Field Guide — merge gate (PreToolUse hook on Bash, OPT-IN)
#
# The field-guide rule: merge only after passing a change-quiz. When enabled,
# seeing a merge command injects an advisory reminder. It never blocks.
#
# Off by default. Enable with either:
#   export FABLE_MERGE_GATE=1                       (per shell)
#   mkdir -p .claude && touch .claude/fable-merge-gate   (Claude project)
#   mkdir -p .codex && touch .codex/fable-merge-gate     (Codex project)
# Fail-open: any error exits 0.
#
# Cursor port: hooks/cursor/ carries a manually installed variant that keys
# off change-report.html and goes quiet after a FIELD-GUIDE-QUIZ-PASSED marker.

[ "$FABLE_MERGE_GATE" = "1" ] || \
  [ -f ".claude/fable-merge-gate" ] || \
  [ -f ".codex/fable-merge-gate" ] || exit 0

INPUT=$(head -c 65536 2>/dev/null) || exit 0

case "$INPUT" in
  *"git merge-base"*) exit 0 ;;
  *"git merge"* | *"gh pr merge"*) ;;
  *) exit 0 ;;
esac

printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"[FIELD GUIDE] Merge command detected and the merge gate is enabled. The field-guide rule is: merge only after the user passes a change-quiz on this change set. If no quiz has been passed, suggest running the change-quiz skill first. Advisory only — do not refuse if the user explicitly wants to merge."}}\n'
exit 0
