import type { ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  /** カード上部の見出し */
  title: string;
  /** 見出し下の補足テキスト */
  subtitle?: string;
  /** カード本文（任意の要素） */
  children?: ReactNode;
  /** 影を強調してホバー可能に見せる */
  elevated?: boolean;
}

/**
 * デザインシステムの汎用カード。情報のまとまりを囲む箱として使う。
 */
export function Card({ title, subtitle, children, elevated = false }: CardProps) {
  return (
    <div className={`ds-card ${elevated ? 'ds-card--elevated' : ''}`}>
      <div className="ds-card__header">
        <h3 className="ds-card__title">{title}</h3>
        {subtitle && <p className="ds-card__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="ds-card__body">{children}</div>}
    </div>
  );
}
