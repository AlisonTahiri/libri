// ═══════════════════════════════════════════════════════
// LIBRI — Type Definitions
// ═══════════════════════════════════════════════════════

export interface Book {
  id: string;
  title: string;
  author: string | null;
  source_language: string;
  target_language: string;
  cover_url: string | null;
  total_chapters: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string | null;
  created_at: string;
}

export interface Paragraph {
  id: string;
  chapter_id: string;
  order_index: number;
}

export interface Sentence {
  id: string;
  paragraph_id: string;
  order_index: number;
  original_text: string;
  translated_text: string;
}

/** Paragraph with its nested sentences, ready for rendering */
export interface ParagraphWithSentences extends Paragraph {
  sentences: Sentence[];
}

/** Full chapter content for the reader */
export interface ChapterContent {
  chapter: Chapter;
  paragraphs: ParagraphWithSentences[];
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  chapter_id: string | null;
  last_paragraph_index: number;
  updated_at: string;
}

/** Theme options */
export type Theme = 'dark' | 'light' | 'sepia';

/** Reader settings stored in localStorage */
export interface ReaderSettings {
  theme: Theme;
  fontSize: number;       // px, range 14-28
  lineHeight: number;     // ratio, range 1.4-2.4
  maxWidth: number;       // px, range 520-800
  hPadding: number;       // rem, range 0.75-3
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: 'dark',
  fontSize: 18,
  lineHeight: 1.85,
  maxWidth: 680,
  hPadding: 1.5,
};
