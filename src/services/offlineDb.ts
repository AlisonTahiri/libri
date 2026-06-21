import Dexie, { type Table } from 'dexie';
import type { ChapterContent } from '../types';

/** Cached chapter for offline reading */
export interface CachedChapter {
  id: string;           // chapter UUID
  bookId: string;
  chapterNumber: number;
  content: ChapterContent;
  cachedAt: number;     // timestamp
}

class LibriDB extends Dexie {
  chapters!: Table<CachedChapter>;

  constructor() {
    super('libri');
    this.version(1).stores({
      chapters: 'id, bookId, chapterNumber',
    });
  }
}

export const offlineDb = new LibriDB();
