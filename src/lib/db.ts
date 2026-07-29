import Dexie, { type EntityTable } from 'dexie';

export interface EpubBook {
  id: string;        // Unique identifier (filename + size hash)
  title: string;
  author?: string;
  coverImage?: string;  // base64 data URL
  lastChapterIndex: number;   // last opened chapter index
  addedAt: number;
}

export interface EpubChapter {
  id: string;           // `${bookId}-${orderIndex}`
  bookId: string;
  orderIndex: number;
  title: string;
  htmlContent: string;  // sanitized HTML, images stripped
}

// Initialize Dexie DB
const db = new Dexie('LibriDb') as Dexie & {
  epubBooks: EntityTable<EpubBook, 'id'>;
  epubChapters: EntityTable<EpubChapter, 'id'>;
};

// v1: original schema with fileData blob
db.version(1).stores({
  epubBooks: 'id, addedAt',
});

// v2: fileData removed, chapters extracted to separate table
db.version(2).stores({
  epubBooks: 'id, addedAt',
  epubChapters: 'id, bookId, orderIndex',
}).upgrade(async tx => {
  // Clear any old books that still have fileData — user will re-import
  await tx.table('epubBooks').clear();
});

export { db };
