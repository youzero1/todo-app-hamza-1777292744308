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

  /* ---------- filter ---------- */
  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddTodoForm onAdd={addTodo} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {usingLocal && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-2">
          Supabase is not connected. Todos are stored in your browser&apos;s local storage.
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
              filter === f
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg
            className="mx-auto h-12 w-12 mb-3 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">
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
      {todos.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
          <span>
            {activeCount} {activeCount === 1 ? 'item' : 'items'} left
          </span>
          <span>{todos.length} total</span>
        </div>
      )}
    </div>
  );
}
