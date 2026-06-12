import './Badge.css';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'error';

export interface BadgeProps {
  /** バッジに表示するテキスト */
  text: string;
  /** 意味合いを表す色調 */
  tone?: BadgeTone;
}

/**
 * デザインシステムのステータスバッジ。状態やラベルを小さく示す。
 */
export function Badge({ text, tone = 'neutral' }: BadgeProps) {
  return <span className={`ds-badge ds-badge--${tone}`}>{text}</span>;
}
