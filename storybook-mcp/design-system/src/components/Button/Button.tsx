import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** ボタン内に表示するラベル */
  label: string;
  /** 見た目のバリアント */
  variant?: ButtonVariant;
  /** サイズ */
  size?: ButtonSize;
  /** 無効化 */
  disabled?: boolean;
  /** クリック時のハンドラ */
  onClick?: () => void;
}

/**
 * デザインシステムの基本ボタン。アプリ全体で一貫したアクション表現に使う。
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`ds-button ds-button--${variant} ds-button--${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
