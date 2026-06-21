import type { Book } from '../types';
import { BookCard } from './BookCard';
import { BookOpen } from 'lucide-react';

interface LibraryProps {
  books: Book[];
  loading: boolean;
  onOpenBook: (book: Book) => void;
}

export function Library({ books, loading, onOpenBook }: LibraryProps) {
  if (loading && books.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-primary)',
    }}>
      {/* Header */}
      <header style={{
        padding: '2rem 1rem 1rem',
        maxWidth: '640px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h1 style={{
          fontFamily: 'var(--reader-font-family)',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Libri
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginTop: '0.3rem',
        }}>
          Lexo dhe mëso gjuhë të reja
        </p>
      </header>

      {/* Book Grid */}
      {books.length > 0 ? (
        <div className="library-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onOpenBook(book)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={64} className="empty-state-icon" />
          <h2 className="empty-state-title">Biblioteka është bosh</h2>
          <p className="empty-state-desc">
            Shto libra duke ekzekutuar skriptin e ngarkimit të përmbajtjes.
          </p>
        </div>
      )}
    </div>
  );
}
