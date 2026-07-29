import { useRef, useState } from 'react';
import type { Book, ReaderSettings, Theme } from '../types';
import { BookCard } from './BookCard';
import { BookOpen, Upload, Settings, Trash2, Pencil, Loader } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type EpubBook } from '../lib/db';
import { SettingsPanel } from './SettingsPanel';
import { parseEpub } from '../services/epubParser';

interface LibraryProps {
  books: Book[];
  loading: boolean;
  onOpenBook: (book: Book) => void;
  onOpenEpub: (book: EpubBook) => void;
  settings: ReaderSettings;
  onSetTheme: (theme: Theme) => void;
  onSetFontSize: (size: number) => void;
  onSetLineHeight: (height: number) => void;
  onSetMaxWidth: (width: number) => void;
  onSetHPadding: (padding: number) => void;
}

export function Library({ 
  books, 
  loading, 
  onOpenBook, 
  onOpenEpub,
  settings,
  onSetTheme,
  onSetFontSize,
  onSetLineHeight,
  onSetMaxWidth,
  onSetHPadding
}: LibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const epubBooks = useLiveQuery(() => db.epubBooks.orderBy('addedAt').reverse().toArray()) || [];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = '';

    setImportError(null);
    setImporting(true);

    try {
      const id = `${file.name}-${file.size}`;

      // Check if already imported
      const existing = await db.epubBooks.get(id);
      if (existing) { setImporting(false); return; }

      // Parse EPUB → extract chapters
      const parsed = await parseEpub(file);

      // Save book record
      await db.epubBooks.add({
        id,
        title: parsed.title || file.name.replace(/\.epub$/i, ''),
        author: parsed.author,
        coverImage: parsed.coverImageBase64,
        lastChapterIndex: 0,
        addedAt: Date.now(),
      });

      // Save chapters
      await db.epubChapters.bulkAdd(
        parsed.chapters.map(ch => ({
          id: `${id}-${ch.orderIndex}`,
          bookId: id,
          orderIndex: ch.orderIndex,
          title: ch.title,
          htmlContent: ch.htmlContent,
        }))
      );
    } catch (err) {
      console.error('EPUB import failed:', err);
      setImportError(err instanceof Error ? err.message : 'Gabim gjatë importimit.');
    } finally {
      setImporting(false);
    }
  };

  const deleteEpub = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (!window.confirm('A jeni të sigurt që doni ta fshini këtë libër? Kjo do të fshijë përgjithmonë edhe progresin tuaj të leximit.')) {
      return;
    }

    // Delete book + all its chapters
    await db.epubBooks.delete(id);
    await db.epubChapters.where('bookId').equals(id).delete();
  };

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
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
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            aria-label="Cilësimet"
          >
            <Settings size={18} />
          </button>

          <input 
            type="file" 
            accept=".epub" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            id="epub-upload"
          />
          <label htmlFor="epub-upload" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            background: importing ? 'var(--text-muted)' : 'var(--accent)',
            color: 'white',
            borderRadius: '8px',
            cursor: importing ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--ui-font-family)',
            fontSize: '0.85rem',
            fontWeight: 600,
            pointerEvents: importing ? 'none' : 'auto',
          }}>
            {importing ? <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Upload size={16} />}
            {importing ? 'Duke importuar...' : 'Hap EPUB'}
          </label>
        </div>
      </header>

      {/* Import error message */}
      {importError && (
        <div style={{
          maxWidth: '640px', margin: '0.75rem auto 0',
          padding: '0.75rem 1rem', borderRadius: '8px',
          background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
          color: 'var(--text-primary)', fontSize: '0.85rem',
          fontFamily: 'var(--ui-font-family)',
        }}>
          ⚠️ {importError}
        </div>
      )}

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Local EPUB Books Section */}
        {epubBooks.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--ui-font-family)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              Librat lokalë EPUB
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {epubBooks.map(book => (
                <div 
                  key={book.id}
                  onClick={() => onOpenEpub(book)}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    border: '1px solid var(--border)'
                  }}>
                    <BookOpen size={20} />
                  </div>
                  
                  <h3 style={{
                    fontFamily: 'var(--ui-font-family)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0,
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--text-primary)'
                  }}>
                    {book.title}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = window.prompt('Vendos titullin e ri për këtë libër:', book.title);
                        if (newTitle && newTitle.trim()) {
                          db.epubBooks.update(book.id, { title: newTitle.trim() }).catch(console.error);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: '6px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Ndrysho titullin"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => deleteEpub(e, book.id)}
                      style={{
                        background: 'rgba(255,0,0,0.1)',
                        border: 'none',
                        color: 'red',
                        padding: '6px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Fshi librin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bilingual Books Section */}
        <h2 style={{
          fontFamily: 'var(--ui-font-family)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
        }}>
        Libraria Jonë
        </h2>
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
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSetTheme={onSetTheme}
        onSetFontSize={onSetFontSize}
        onSetLineHeight={onSetLineHeight}
        onSetMaxWidth={onSetMaxWidth}
        onSetHPadding={onSetHPadding}
      />
    </div>
  );
}
