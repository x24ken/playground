import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'DesignSystem/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    text: 'ラベル',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'success', 'warning', 'error'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: 'neutral', text: '下書き' } };
export const Success: Story = { args: { tone: 'success', text: '公開中' } };
export const Warning: Story = { args: { tone: 'warning', text: '保留' } };
export const Error: Story = { args: { tone: 'error', text: '失敗' } };
