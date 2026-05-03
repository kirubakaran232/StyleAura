import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ autoFocus = false, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          className="input pl-11 pr-4"
          placeholder="Search posts, products, categories..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus={autoFocus}
        />
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="btn-ghost p-2.5 rounded-xl">
          <FiX size={18} />
        </button>
      )}
    </form>
  );
}
