'use client';

import { useState, useRef } from 'react';

export default function AddTodoForm({ onAdd }: { onAdd: (title: string, file?: File) => void }) {
  const [title, setTitle] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, selectedFile || undefined);
    setTitle('');
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-all duration-200"
          title="Attach image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-5 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-violet-500/25 active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          Add
        </button>
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </form>
  );
}
