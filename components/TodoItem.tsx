'use client';

import { useState } from 'react';
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
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [expandedImgError, setExpandedImgError] = useState(false);

  // Build a working image URL
  // Supabase public URLs work as-is; blob: URLs from local mode also work.
  // We add a cache-busting param to avoid stale browser cache for Supabase URLs.
  const imageUrl = todo.image_url
    ? todo.image_url.startsWith('blob:')
      ? todo.image_url
      : todo.image_url
    : null;

  return (
    <li className="todo-item-enter bg-white rounded-xl group hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
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

        <div className="flex-1 min-w-0">
          <span
            className={`text-sm transition-all duration-200 block ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'
            }`}
          >
            {todo.title}
          </span>
          {imageUrl && !imgError && (
            <button
              onClick={() => setImageExpanded(!imageExpanded)}
              className="mt-1 text-xs text-violet-500 hover:text-violet-600 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {imageExpanded ? 'Hide image' : 'Show image'}
            </button>
          )}
        </div>

        {imageUrl && !imgError && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-gray-200"
            onError={() => setImgError(true)}
          />
        )}

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
      </div>

      {/* Expanded image */}
      {imageUrl && imageExpanded && !expandedImgError && (
        <div className="px-4 pb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Todo attachment"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
            onError={() => setExpandedImgError(true)}
          />
        </div>
      )}
    </li>
  );
}
