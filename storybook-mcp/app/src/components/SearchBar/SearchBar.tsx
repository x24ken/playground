import { useState } from 'react';
import './SearchBar.css';

export interface SearchBarProps {
  /** 入力欄のプレースホルダ */
  placeholder?: string;
  /** 検索実行時のハンドラ（入力値を受け取る） */
  onSearch?: (query: string) => void;
}

/**
 * このアプリ固有の検索バー。ヘッダーやリスト画面の上部で使う想定。
 * デザインシステムには含まれないアプリ専用コンポーネント。
 */
export function SearchBar({ placeholder = '検索...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  return (
    <form
      className="app-searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(query);
      }}
    >
      <input
        className="app-searchbar__input"
        type="search"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="app-searchbar__submit" type="submit">
        検索
      </button>
    </form>
  );
}
