import { useRef, useState } from 'react';
import type { Book, ReaderSettings, Theme } from '../types';
import { BookCard } from './BookCard';
import { ConfirmModal } from './ConfirmModal';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type EpubBook } from '../lib/db';
import { offlineDb } from '../services/offlineDb';
import { downloadBook, removeBookDownload } from '../services/bookService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { SettingsPanel } from './SettingsPanel';
import { parseEpub } from '../services/epubParser';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Settings, Loader2, Upload, Book as BookIcon, Pen, Trash2, BookOpen, WifiOff } from 'lucide-react';

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
  const { t } = useLanguage();
  const isOnline = useNetworkStatus();
  
  const downloadedBooksData = useLiveQuery(() => offlineDb.downloadedBooks.toArray()) || [];
  const downloadedBookIds = new Set(downloadedBooksData.map(db => db.id));

  type ConfirmAction = 
    | { type: 'download'; book: Book }
    | { type: 'remove_download'; book: Book }
    | { type: 'delete_epub'; bookId: string };

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);

  const displayedBooks = isOnline ? books : books.filter(b => downloadedBookIds.has(b.id));

  const handleDownloadToggle = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    if (downloadedBookIds.has(book.id)) {
      setConfirmAction({ type: 'remove_download', book });
    } else {
      if (!isOnline) {
        alert("Ju duhet internet për të shkarkuar libra.");
        return;
      }
      setConfirmAction({ type: 'download', book });
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    
    const action = confirmAction;
    setConfirmAction(null);

    try {
      if (action.type === 'download') {
        setDownloadingBookId(action.book.id);
        await downloadBook(action.book.id);
        setDownloadingBookId(null);
      } else if (action.type === 'remove_download') {
        await removeBookDownload(action.book.id);
      } else if (action.type === 'delete_epub') {
        await db.epubBooks.delete(action.bookId);
        await db.epubChapters.where('bookId').equals(action.bookId).delete();
      }
    } catch (err) {
      console.error('Action failed', err);
      alert('Veprimi dështoi.');
      setDownloadingBookId(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = '';

    setImportError(null);
    setImporting(true);

    try {
      const id = `${file.name}-${file.size}`;

      const existing = await db.epubBooks.get(id);
      if (existing) { setImporting(false); return; }

      const parsed = await parseEpub(file);

      await db.epubBooks.add({
        id,
        title: parsed.title || file.name.replace(/\.epub$/i, ''),
        author: parsed.author,
        coverImage: parsed.coverImageBase64,
        lastChapterIndex: 0,
        addedAt: Date.now(),
      });

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

  const deleteEpub = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmAction({ type: 'delete_epub', bookId: id });
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-surface-variant border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col pt-16 pb-24 md:pb-8 relative">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-center px-reading-padding-x h-16 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display-reading text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary to-tertiary">
                Libri
              </h1>
            </div>
            <p className="hidden md:block font-ui-label-sm text-ui-label-sm text-on-surface-variant font-medium mt-1">
              {t('tagline')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button 
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings" 
              className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-variant/30 transition-colors active:scale-95 duration-200 text-on-surface"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-gutter py-reading-padding-y flex flex-col gap-ui-gap-lg">
        
        {/* Local EPUB Books Section */}
        {epubBooks.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-ui-header text-ui-header text-on-surface">{t('epubBooks')}</h2>
              
              <input 
                type="file" 
                accept=".epub" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                id="epub-upload"
              />
              <label 
                htmlFor="epub-upload"
                className="bg-surface-variant text-on-surface-variant font-ui-button text-[12px] px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-outline-variant/30 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                style={{ pointerEvents: importing ? 'none' : 'auto' }}
              >
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {t('addEpub')}
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-gutter">
              {epubBooks.map(book => (
                <article 
                  key={book.id}
                  onClick={() => onOpenEpub(book)}
                  className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10"
                >
                  <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden relative shadow-sm flex-shrink-0 bg-surface-variant">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookIcon className="w-8 h-8 text-on-surface-variant opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-body-reading text-[18px] md:text-[22px] font-semibold text-on-surface leading-tight mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      {book.author && <p className="font-ui-label-sm text-ui-label-sm text-on-surface-variant line-clamp-1">{book.author}</p>}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="bg-tertiary/15 text-tertiary font-ui-label-sm text-[10px] font-semibold px-2 py-0.5 rounded-full">EPUB Lokal</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTitle = window.prompt('Vendos titullin e ri për këtë libër:', book.title);
                            if (newTitle && newTitle.trim()) {
                              db.epubBooks.update(book.id, { title: newTitle.trim() }).catch(console.error);
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          <Pen className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => deleteEpub(e, book.id)}
                          className="w-8 h-8 rounded-full bg-error-container/50 text-error flex items-center justify-center hover:bg-error-container transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bento Grid Cloud Library */}
        <section>
          {importError && (
            <div className="bg-error-container/30 border border-error/30 text-on-surface p-3 rounded-lg text-sm mb-4">
              ⚠️ {importError}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-ui-header text-ui-header text-on-surface">{t('library')}</h2>
            {epubBooks.length === 0 && (
              <>
                <input 
                  type="file" 
                  accept=".epub" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                  id="epub-upload-empty"
                />
                <label 
                  htmlFor="epub-upload-empty"
                  className="bg-primary text-on-primary font-ui-button text-[12px] px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-surface-tint transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  style={{ pointerEvents: importing ? 'none' : 'auto' }}
                >
                  {importing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {t('addEpub')}
                </label>
              </>
            )}
          </div>
          {!loading && displayedBooks.length === 0 && (
            <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <BookOpen className="w-12 h-12 text-on-surface-variant" />
              <p className="text-on-surface-variant">{isOnline ? t('noBooks') : "Nuk keni libra të shkarkuar për lexim pa internet."}</p>
            </div>
          )}
          {displayedBooks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onOpenBook(book)}
                  isDownloaded={downloadedBookIds.has(book.id)}
                  isDownloading={downloadingBookId === book.id}
                  onDownloadClick={(e) => handleDownloadToggle(e, book)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-surface-variant text-on-surface-variant px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg z-50 border border-outline-variant/20 backdrop-blur-md">
          <WifiOff className="w-4 h-4" />
          Ju jeni offline. Shfaqen vetëm librat e shkarkuar.
        </div>
      )}

      {/* Global Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmAction !== null}
        title={
          confirmAction?.type === 'download' ? 'Shkarko Libër' :
          confirmAction?.type === 'remove_download' ? 'Hiq Shkarkimin' :
          'Fshi Librin EPUB'
        }
        description={
          confirmAction?.type === 'download' ? (
            <>Dëshironi të shkarkoni <strong>{confirmAction.book.title}</strong> për lexim offline? Kjo do të ruajë të gjithë kapitujt në pajisjen tuaj.</>
          ) : confirmAction?.type === 'remove_download' ? (
            <>A jeni i sigurt që doni të hiqni <strong>{confirmAction.book.title}</strong> nga pajisja juaj? Mund ta shkarkoni sërish kur të keni internet.</>
          ) : (
            <>{t('deleteConfirm') || 'A jeni i sigurt që doni të fshini këtë libër EPUB?'}</>
          )
        }
        confirmText={confirmAction?.type === 'download' ? 'Shkarko' : 'Fshi'}
        confirmVariant={confirmAction?.type === 'download' ? 'primary' : 'error'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSetTheme={onSetTheme}
        onSetFontSize={onSetFontSize}
        onSetLineHeight={onSetLineHeight}
        onSetMaxWidth={onSetMaxWidth}
        onSetHPadding={onSetHPadding}
        showReaderSettings={false}
      />
    </div>
  );
}
