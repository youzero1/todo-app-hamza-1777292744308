'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Todo } from '@/types';
import TodoItem from '@/components/TodoItem';
import AddTodoForm from '@/components/AddTodoForm';

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocal, setUsingLocal] = useState(false);

  const supabase = getSupabase();

  /* ---------- helpers for local-only mode ---------- */
  function localId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  /* ---------- fetch ---------- */
  const fetchTodos = useCallback(async () => {
    if (!supabase) {
      setUsingLocal(true);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('todos') : null;
      setTodos(stored ? JSON.parse(stored) : []);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTodos((data as Todo[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      console.error('Supabase fetch error, falling back to local storage:', message);
      setUsingLocal(true);
      const stored = typeof window !== 'undefined' ? localStorage.getItem('todos') : null;
      setTodos(stored ? JSON.parse(stored) : []);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /* persist to localStorage when in local mode */
  useEffect(() => {
    if (usingLocal && typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, usingLocal]);

  /* ---------- add ---------- */
  async function addTodo(title: string) {
    setError(null);

    if (usingLocal || !supabase) {
      const newTodo: Todo = {
        id: localId(),
        title,
        completed: false,
        created_at: new Date().toISOString(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('todos')
      .insert([{ title, completed: false }])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTodos((prev) => [data as Todo, ...prev]);
  }

  /* ---------- toggle ---------- */
  async function toggleTodo(id: string, completed: boolean) {
    setError(null);

    if (usingLocal || !supabase) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t)),
      );
      return;
    }

    const { error: updateError } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
  }

  /* ---------- delete ---------- */
  async function deleteTodo(id: string) {
    setError(null);

    if (usingLocal || !supabase) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }

    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  /* ---------- clear completed ---------- */
  async function clearCompleted() {
    setError(null);
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    if (completedIds.length === 0) return;

    if (usingLocal || !supabase) {
      setTodos((prev) => prev.filter((t) => !t.completed));
      return;
    }

    for (const id of completedIds) {
      const { error: deleteError } = await supabase.from('todos').delete().eq('id', id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
    }

    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  /* ---------- filter ---------- */
  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 mt-4 font-medium">Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AddTodoForm onAdd={addTodo} />

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {usingLocal && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Supabase is not connected. Todos are stored in your browser&apos;s local storage.
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
              filter === f
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
            {f === 'all' && ` (${todos.length})`}
            {f === 'active' && ` (${activeCount})`}
            {f === 'completed' && ` (${completedCount})`}
          </button>
        ))}
      </div>

      {/* Progress */}
      {todos.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {completedCount}/{todos.length} done
          </span>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-7 w-7 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            {filter === 'all'
              ? 'No todos yet. Add one above!'
              : `No ${filter} todos.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </ul>
      )}

      {/* Footer */}
      {completedCount > 0 && (
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={clearCompleted}
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}
