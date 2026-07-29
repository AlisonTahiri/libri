-- ═══════════════════════════════════════════════════════
-- LIBRI — Database Migration 002
-- Add English translation support
-- ═══════════════════════════════════════════════════════

-- Rename the existing translated_text column to translated_text_sq
ALTER TABLE public.sentences 
RENAME COLUMN translated_text TO translated_text_sq;

-- Add the new translated_text_en column
ALTER TABLE public.sentences 
ADD COLUMN translated_text_en TEXT;
