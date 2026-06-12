import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatChip } from './StatChip';

const meta = {
  title: 'App/StatChip',
  component: StatChip,
  tags: ['autodocs'],
  args: {
    label: '売上',
    value: '¥1,200,000',
  },
} satisfies Meta<typeof StatChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Increase: Story = {
  args: { label: 'アクティブユーザー', value: '8,420', delta: 12 },
};

export const Decrease: Story = {
  args: { label: '解約数', value: '37', delta: -5 },
};
