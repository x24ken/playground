import { Button, Badge, Card } from 'design-system';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { StatChip } from '../components/StatChip/StatChip';
import './DashboardHeader.css';

export interface DashboardHeaderProps {
  /** ダッシュボードのタイトル */
  title: string;
  /** 現在の公開ステータス */
  status?: 'published' | 'draft';
}

/**
 * ダッシュボード上部のヘッダー画面。
 * MCP で取得した既存コンポーネントだけを再利用して組み立てている：
 * - design-system: Card / Button / Badge
 * - app固有: SearchBar / StatChip
 */
export function DashboardHeader({ title, status = 'published' }: DashboardHeaderProps) {
  return (
    <Card title={title} subtitle="今期のサマリーと操作" elevated>
      <div className="dashboard-header__top">
        <Badge
          text={status === 'published' ? '公開中' : '下書き'}
          tone={status === 'published' ? 'success' : 'neutral'}
        />
        <Button label="レポートを公開" variant="primary" size="md" onClick={() => {}} />
      </div>

      <div className="dashboard-header__search">
        <SearchBar placeholder="指標やユーザーを検索..." onSearch={() => {}} />
      </div>

      <div className="dashboard-header__stats">
        <StatChip label="売上" value="¥1,200,000" delta={8} />
        <StatChip label="アクティブユーザー" value="8,420" delta={12} />
        <StatChip label="解約数" value="37" delta={-5} />
      </div>
    </Card>
  );
}
