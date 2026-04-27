import TodoList from '@/components/TodoList';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Todo</h1>
          <p className="text-gray-400 mt-1 text-sm">Stay organized, get things done.</p>
        </div>

        {/* Todo list */}
        <TodoList />
      </div>
    </main>
  );
}
