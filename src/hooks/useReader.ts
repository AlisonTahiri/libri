import { useState, useEffect, useCallback } from 'react';
import type { Book, Chapter, ChapterContent } from '../types';
import {
  fetchBooks,
  fetchChapters,
  fetchChapterContent,
  getReadingProgress,
  saveReadingProgress,
  prefetchChapters,
} from '../services/bookService';

export function useReader() {
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all books
  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError('Nuk u ngarkuan librat.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open a book → load chapters
  const openBook = useCallback(async (book: Book) => {
    setLoading(true);
    setError(null);
    setCurrentBook(book);
    try {
      const chapterList = await fetchChapters(book.id);
      setChapters(chapterList);

      // Resume from last position or start at chapter 1
      const progress = getReadingProgress(book.id);
      const targetChapterId = progress?.chapter_id || chapterList[0]?.id;

      if (targetChapterId) {
        const content = await fetchChapterContent(targetChapterId);
        setCurrentChapter(content);

        // Prefetch next chapters
        const chapterNum = content?.chapter.chapter_number ?? 0;
        prefetchChapters(book.id, chapterNum);
      }
    } catch (err) {
      setError('Nuk u ngarkua libri.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigate to a specific chapter
  const goToChapter = useCallback(async (chapterId: string) => {
    if (!currentBook) return;
    setLoading(true);
    try {
      const content = await fetchChapterContent(chapterId);
      setCurrentChapter(content);

      if (content) {
        saveReadingProgress(currentBook.id, chapterId, 0);
        prefetchChapters(currentBook.id, content.chapter.chapter_number);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentBook]);

  // Navigate to next/previous chapter
  const goToNextChapter = useCallback(() => {
    if (!currentChapter) return;
    const currentNum = currentChapter.chapter.chapter_number;
    const next = chapters.find((c) => c.chapter_number === currentNum + 1);
    if (next) goToChapter(next.id);
  }, [currentChapter, chapters, goToChapter]);

  const goToPrevChapter = useCallback(() => {
    if (!currentChapter) return;
    const currentNum = currentChapter.chapter.chapter_number;
    const prev = chapters.find((c) => c.chapter_number === currentNum - 1);
    if (prev) goToChapter(prev.id);
  }, [currentChapter, chapters, goToChapter]);

  // Close book → back to library
  const closeBook = useCallback(() => {
    setCurrentBook(null);
    setCurrentChapter(null);
    setChapters([]);
  }, []);

  // Save scroll position as reading progress
  const updateProgress = useCallback(
    (paragraphIndex: number) => {
      if (currentBook && currentChapter) {
        saveReadingProgress(currentBook.id, currentChapter.chapter.id, paragraphIndex);
      }
    },
    [currentBook, currentChapter]
  );

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return {
    books,
    chapters,
    currentBook,
    currentChapter,
    loading,
    error,
    openBook,
    closeBook,
    goToChapter,
    goToNextChapter,
    goToPrevChapter,
    updateProgress,
    loadBooks,
  };
}
