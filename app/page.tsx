import TodoList from '@/components/TodoList';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-xl fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl todo-gradient shadow-lg shadow-indigo-500/30 mb-5">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            My Todos
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">Stay organized, get things done.</p>
        </div>

        {/* Todo list */}
        <TodoList />
      </div>
    </main>
  );
}
