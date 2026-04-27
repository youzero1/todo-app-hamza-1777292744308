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
      <div className={`flex gap-3 p-2 rounded-2xl dark-card transition-all duration-300 ${
        focused 
          ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
          : 'shadow-md shadow-black/20'
      }`}>
        <div className="flex-1 flex items-center pl-3">
          <svg className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What needs to be done?"
            className="flex-1 py-2.5 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-6 py-2.5 todo-gradient text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-none disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#1e2a45]"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
