'use client';

import { useState } from 'react';

export default function AddTodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-1 transition-all duration-300 border ${
        focused
          ? 'border-violet-400 shadow-md shadow-violet-500/10'
          : 'border-gray-200 shadow-sm'
      }`}>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add a new task..."
          className="flex-1 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-5 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-violet-500/25 active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          Add
        </button>
      </div>
    </form>
  );
}
