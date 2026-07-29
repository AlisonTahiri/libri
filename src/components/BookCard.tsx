import type { Book } from '../types';
import { BookOpen, Globe, Sparkles, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const LANGUAGE_ABBREVIATIONS: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  sq: 'SQ',
};

export function BookCard({ book, onClick }: BookCardProps) {
  const sourceLang = LANGUAGE_ABBREVIATIONS[book.source_language] || book.source_language.toUpperCase();
  const targetLang = LANGUAGE_ABBREVIATIONS[book.target_language] || book.target_language.toUpperCase();

  const isOriginal = book.author === 'Libri Originals';
  const displayAuthor = isOriginal ? null : book.author;

  return (
    <div className="book-card" onClick={onClick} role="button" tabIndex={0}>
      <h3 className="book-card-title">{book.title}</h3>
      {displayAuthor && <p className="book-card-author">by {displayAuthor}</p>}

      <div className="book-card-meta">
        {isOriginal && (
          <span className="book-card-badge originals-badge">
            <Sparkles size={10} />
            Originals
          </span>
        )}
        {book.level && (
          <span className="book-card-badge level-badge">
            <Hash size={10} />
            {book.level}
          </span>
        )}
        <span className="book-card-badge">
          <Globe size={10} />
          {sourceLang} → {targetLang}
        </span>
        <span className="book-card-chapters">
          <BookOpen size={12} />
          {book.total_chapters} kapituj
        </span>
      </div>
    </div>
  );
}
