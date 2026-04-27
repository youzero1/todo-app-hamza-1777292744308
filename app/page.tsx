import TodoList from '@/components/TodoList';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-lg fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Daily To Do List
          </h1>
        </div>

        {/* Todo list */}
        <TodoList />
      </div>
    </main>
  );
}
