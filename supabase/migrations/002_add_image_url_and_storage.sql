-- Add image_url column to todos table
ALTER TABLE todos ADD COLUMN IF NOT EXISTS image_url text;

-- Create a storage bucket for todo images
INSERT INTO storage.buckets (id, name, public)
VALUES ('todo-images', 'todo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous users to upload files to the todo-images bucket
CREATE POLICY "todo_images_anon_insert" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'todo-images');

-- Allow anonymous users to read files from the todo-images bucket
CREATE POLICY "todo_images_anon_select" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'todo-images');

-- Allow anonymous users to delete files from the todo-images bucket
CREATE POLICY "todo_images_anon_delete" ON storage.objects
  FOR DELETE TO anon
  USING (bucket_id = 'todo-images');
