import './StatChip.css';

export interface StatChipProps {
  /** 指標のラベル（例: 売上） */
  label: string;
  /** 指標の値（例: ¥1,200,000） */
  value: string;
  /** 前期比などの増減（正の値は緑、負の値は赤で表示） */
  delta?: number;
}

/**
 * このアプリ固有のKPI表示チップ。ダッシュボード上部の指標表示に使う。
 * デザインシステムには含まれないアプリ専用コンポーネント。
 */
export function StatChip({ label, value, delta }: StatChipProps) {
  const deltaClass =
    delta === undefined ? '' : delta >= 0 ? 'app-statchip__delta--up' : 'app-statchip__delta--down';
  return (
    <div className="app-statchip">
      <span className="app-statchip__label">{label}</span>
      <span className="app-statchip__value">{value}</span>
      {delta !== undefined && (
        <span className={`app-statchip__delta ${deltaClass}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}
