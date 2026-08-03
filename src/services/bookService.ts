import { supabase } from '../lib/supabase';
import { offlineDb } from './offlineDb';
import type {
  Book,
  Chapter,
  ChapterContent,
  ParagraphWithSentences,
  ReadingProgress,
} from '../types';

// ═══════════════════════════════════════════════════════
// BOOK SERVICE — Data fetching from Supabase + offline cache
// ═══════════════════════════════════════════════════════

/** Fetch all books */
export async function fetchBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (data && data.length > 0) {
      try {
        await offlineDb.books.bulkPut(data);
      } catch (e) {
        console.error('Failed to cache books', e);
      }
    }
    return data ?? [];
  } catch (err) {
    // Fallback to offline cache
    try {
      const cached = await offlineDb.books.orderBy('created_at').reverse().toArray();
      if (cached && cached.length > 0) return cached;
    } catch (cacheErr) {
      console.error('Offline cache error', cacheErr);
    }
    throw err;
  }
}

/** Fetch chapters for a book */
export async function fetchChapters(bookId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Fetch full chapter content (paragraphs + sentences), with offline fallback */
export async function fetchChapterContent(chapterId: string): Promise<ChapterContent | null> {
  // Try online first
  try {
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError) throw chapterError;

    const { data: paragraphs, error: pError } = await supabase
      .from('paragraphs')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_index', { ascending: true });

    if (pError) throw pError;

    if (!paragraphs || paragraphs.length === 0) {
      return { chapter, paragraphs: [] };
    }

    const paragraphIds = paragraphs.map((p) => p.id);

    const { data: sentences, error: sError } = await supabase
      .from('sentences')
      .select('*')
      .in('paragraph_id', paragraphIds)
      .order('order_index', { ascending: true });

    if (sError) throw sError;

    // Group sentences by paragraph
    const sentencesByParagraph = new Map<string, typeof sentences>();
    for (const s of sentences ?? []) {
      const existing = sentencesByParagraph.get(s.paragraph_id) ?? [];
      existing.push(s);
      sentencesByParagraph.set(s.paragraph_id, existing);
    }

    const paragraphsWithSentences: ParagraphWithSentences[] = paragraphs.map((p) => ({
      ...p,
      sentences: sentencesByParagraph.get(p.id) ?? [],
    }));

    const content: ChapterContent = { chapter, paragraphs: paragraphsWithSentences };

    // Cache for offline
    try {
      await offlineDb.chapters.put({
        id: chapterId,
        bookId: chapter.book_id,
        chapterNumber: chapter.chapter_number,
        content,
        cachedAt: Date.now(),
      });
    } catch {
      // Caching failed silently
    }

    return content;
  } catch {
    // Try offline cache
    const cached = await offlineDb.chapters.get(chapterId);
    if (cached) return cached.content;
    return null;
  }
}

/** Get or create reading progress for a book (no auth, uses localStorage fallback) */
export function getReadingProgress(bookId: string): ReadingProgress | null {
  const key = `libri-progress-${bookId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as ReadingProgress;
    }
    return null;
  } catch {
    return null;
  }
}

/** Save reading progress locally */
export function saveReadingProgress(
  bookId: string,
  chapterId: string,
  lastParagraphIndex: number,
  scrollPosition?: number
): void {
  const key = `libri-progress-${bookId}`;
  const progress: ReadingProgress = {
    id: bookId,
    book_id: bookId,
    chapter_id: chapterId,
    last_paragraph_index: lastParagraphIndex,
    scroll_position: scrollPosition,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(progress));
}

/** Prefetch next N chapters in background */
export async function prefetchChapters(bookId: string, afterChapterNumber: number, count = 2) {
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('book_id', bookId)
    .gt('chapter_number', afterChapterNumber)
    .order('chapter_number', { ascending: true })
    .limit(count);

  if (!chapters) return;

  // Fetch in background without blocking
  for (const ch of chapters) {
    fetchChapterContent(ch.id).catch(() => {});
  }
}

/** Download entire book for offline use */
export async function downloadBook(bookId: string, onProgress?: (progress: number) => void): Promise<void> {
  const chapters = await fetchChapters(bookId);
  if (!chapters || chapters.length === 0) return;
  
  let completed = 0;
  for (const ch of chapters) {
    await fetchChapterContent(ch.id);
    completed++;
    if (onProgress) onProgress(Math.round((completed / chapters.length) * 100));
  }
  
  await offlineDb.downloadedBooks.put({
    id: bookId,
    downloadedAt: Date.now(),
  });
}

/** Remove a downloaded book from offline storage */
export async function removeBookDownload(bookId: string): Promise<void> {
  await offlineDb.downloadedBooks.delete(bookId);
  await offlineDb.chapters.where('bookId').equals(bookId).delete();
}
