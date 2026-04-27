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
    <li className="todo-item-enter flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl group hover:shadow-md transition-all duration-200 border border-gray-100">
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`checkbox-ring flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-violet-500 border-violet-500'
            : 'border-gray-300 hover:border-violet-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
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
        className={`flex-1 text-sm transition-all duration-200 ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
        aria-label="Delete todo"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}
