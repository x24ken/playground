import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'DesignSystem/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'カードタイトル',
    subtitle: '補足テキスト',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'カード本文。情報のまとまりをここに置く。',
  },
};

export const Elevated: Story = {
  args: {
    elevated: true,
    title: '浮き上がるカード',
    children: '影で強調したカード。',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'タイトルだけのカード',
    subtitle: undefined,
  },
};
