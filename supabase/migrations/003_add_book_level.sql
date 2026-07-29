-- 003_add_book_level.sql
-- Add level column to books table

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS level TEXT;

-- Update existing books with estimated levels
UPDATE public.books SET level = 'A2' WHERE title = 'Neuanfang in Wien';
UPDATE public.books SET level = 'A2' WHERE title = 'Der Sommer am See';
