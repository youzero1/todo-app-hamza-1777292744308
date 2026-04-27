'use client';

import type { Todo } from '@/types';

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="todo-item-enter flex items-center gap-4 px-5 py-4 dark-card rounded-2xl group hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300">
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`checkbox-ring flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent shadow-md shadow-indigo-500/30'
            : 'border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm font-medium transition-all duration-200 ${
          todo.completed ? 'line-through text-slate-600 opacity-60' : 'text-slate-200'
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10"
        aria-label="Delete todo"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </li>
  );
}
