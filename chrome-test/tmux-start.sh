#!/bin/bash
set -e

SESSION="chrome-test"
DIR="$(cd "$(dirname "$0")" && pwd)"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Existing '$SESSION' session found. Attaching..."
  tmux attach -t "$SESSION"
  exit 0
fi

# 新セッション(detached)作成 + 左ペインIDを取得
tmux new-session -d -s "$SESSION" -c "$DIR" -n "main"
SERVE_PANE=$(tmux display-message -p -t "$SESSION:main" '#{pane_id}')

# 右ペインを分割で作成 + IDを取得（-P -Fで返す）
CLAUDE_PANE=$(tmux split-window -h -t "$SERVE_PANE" -c "$DIR" -P -F '#{pane_id}')

# 各ペインにIDで明示指定してコマンド送信
tmux send-keys -t "$SERVE_PANE" "./serve.sh" C-m
tmux send-keys -t "$CLAUDE_PANE" "claude --chrome" C-m

# 右ペインにフォーカスしてattach
tmux select-pane -t "$CLAUDE_PANE"
tmux attach -t "$SESSION"
