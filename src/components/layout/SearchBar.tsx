import { useState } from 'react';
import { SearchIcon } from '../icons';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = '검색어를 입력하세요',
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder:text-gray-400"
        />
      </div>
    </form>
  );
};
