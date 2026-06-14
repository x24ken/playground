import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardHeader } from './DashboardHeader';

const meta = {
  title: 'App/DashboardHeader',
  component: DashboardHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: '売上ダッシュボード',
  },
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Published: Story = {
  args: { status: 'published' },
};

export const Draft: Story = {
  args: { status: 'draft', title: '新レポート（作成中）' },
};
