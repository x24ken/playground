import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'DesignSystem/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: 'ボタン',
    onClick: () => {},
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', label: '保存する' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'キャンセル' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: '削除する' },
};

export const Small: Story = {
  args: { size: 'sm', label: '小' },
};

export const Large: Story = {
  args: { size: 'lg', label: '大きいボタン' },
};

export const Disabled: Story = {
  args: { disabled: true, label: '無効' },
};
