import Dexie, { type Table } from 'dexie';
import type { ChapterContent, Book } from '../types';

/** Cached chapter for offline reading */
export interface CachedChapter {
  id: string;           // chapter UUID
  bookId: string;
  chapterNumber: number;
  content: ChapterContent;
  cachedAt: number;     // timestamp
}

export interface DownloadedBook {
  id: string;
  downloadedAt: number;
}

class LibriDB extends Dexie {
  chapters!: Table<CachedChapter>;
  books!: Table<Book>;
  downloadedBooks!: Table<DownloadedBook>;

  constructor() {
    super('libri');
    this.version(1).stores({
      chapters: 'id, bookId, chapterNumber',
    });
    this.version(2).stores({
      chapters: 'id, bookId, chapterNumber',
      books: 'id, created_at',
      downloadedBooks: 'id, downloadedAt',
    });
  }
}

export const offlineDb = new LibriDB();
