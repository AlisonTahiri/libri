-- ═══════════════════════════════════════════════════════
-- LIBRI — Database Schema
-- Creates tables: books, chapters, paragraphs, sentences, reading_progress
-- ═══════════════════════════════════════════════════════

-- Books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  source_language TEXT NOT NULL DEFAULT 'de',
  target_language TEXT NOT NULL DEFAULT 'sq',
  cover_url TEXT,
  total_chapters INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(book_id, chapter_number)
);

-- Paragraphs table (preserves text visual structure)
CREATE TABLE IF NOT EXISTS public.paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  
  UNIQUE(chapter_id, order_index)
);

-- Sentences table (core content unit: original + translation)
CREATE TABLE IF NOT EXISTS public.sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id UUID NOT NULL REFERENCES public.paragraphs(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  
  UNIQUE(paragraph_id, order_index)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_paragraphs_chapter_id ON public.paragraphs(chapter_id);
CREATE INDEX IF NOT EXISTS idx_sentences_paragraph_id ON public.sentences(paragraph_id);

-- ═══════════════════════════════════════════════════════
-- RLS Policies (open read for now — personal tool)
-- ═══════════════════════════════════════════════════════

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentences ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Public read access" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.paragraphs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.sentences FOR SELECT USING (true);

-- Allow insert/update/delete for service role (used by scripts)
CREATE POLICY "Service role full access" ON public.books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.paragraphs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.sentences FOR ALL USING (true) WITH CHECK (true);
