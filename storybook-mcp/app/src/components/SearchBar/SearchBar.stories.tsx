import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'App/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    placeholder: 'キーワードで検索...',
    onSearch: () => {},
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomPlaceholder: Story = {
  args: { placeholder: 'ユーザー名を入力' },
};
