import Dexie, { type EntityTable } from 'dexie';

export interface EpubBook {
  id: string; // Unique identifier for the book (e.g., filename + size)
  title: string;
  fileData: ArrayBuffer;
  coverImage?: string; // base64 data URL
  lastLocation?: string; // epub.js CFI
  addedAt: number;
}

// Initialize Dexie DB
const db = new Dexie('LibriDb') as Dexie & {
  epubBooks: EntityTable<EpubBook, 'id'>;
};

// Schema declaration
db.version(1).stores({
  epubBooks: 'id, addedAt' // Primary key is id, index on addedAt
});

export { db };
