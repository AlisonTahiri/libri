import type { Book } from '../types';
import { BookOpen, Globe } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Gjermanisht',
  en: 'Anglisht',
  fr: 'Frëngjisht',
  it: 'Italisht',
  es: 'Spanjisht',
  sq: 'Shqip',
};

export function BookCard({ book, onClick }: BookCardProps) {
  const sourceLang = LANGUAGE_NAMES[book.source_language] || book.source_language;
  const targetLang = LANGUAGE_NAMES[book.target_language] || book.target_language;

  return (
    <div className="book-card" onClick={onClick} role="button" tabIndex={0}>
      <h3 className="book-card-title">{book.title}</h3>
      {book.author && <p className="book-card-author">{book.author}</p>}

      <div className="book-card-meta">
        <span className="book-card-badge">
          <Globe size={10} />
          {sourceLang} → {targetLang}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <BookOpen size={12} />
          {book.total_chapters} kapituj
        </span>
      </div>
    </div>
  );
}
