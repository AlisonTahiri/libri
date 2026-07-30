import { useState, useEffect } from 'react';
import { useReader } from './hooks/useReader';
import { useReaderSettings } from './hooks/useReaderSettings';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { EpubChapterReader } from './components/EpubChapterReader';
import { db, type EpubBook, type EpubChapter } from './lib/db';
import { parseEpub } from './services/epubParser';

function App() {
  const {
    books,
    chapters,
    currentBook,
    currentChapter,
    loading,
    openBook,
    closeBook,
    goToChapter,
    goToNextChapter,
    goToPrevChapter,
    updateProgress,
  } = useReader();

  const {
    settings,
    setTheme,
    setFontSize,
    setLineHeight,
    setMaxWidth,
    setHPadding,
  } = useReaderSettings();

  const [currentEpub, setCurrentEpub] = useState<EpubBook | null>(null);
  const [epubChapters, setEpubChapters] = useState<EpubChapter[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      if (currentEpub) {
        setCurrentEpub(null);
        setEpubChapters([]);
      }
      if (currentBook) {
        closeBook();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentEpub, currentBook, closeBook]);

  const handleOpenEpub = async (book: EpubBook) => {
    const chs = await db.epubChapters
      .where('bookId').equals(book.id)
      .sortBy('orderIndex');
    setEpubChapters(chs);
    setCurrentEpub(book);
    window.history.pushState({ view: 'reader' }, '', '#reader');
  };

  useEffect(() => {
    if ('launchQueue' in window && window.launchQueue) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files || launchParams.files.length === 0) return;
        
        for (const fileHandle of launchParams.files) {
          try {
            const file = await fileHandle.getFile();
            if (file.name.endsWith('.epub') || file.type === 'application/epub+zip') {
              const id = `${file.name}-${file.size}`;
              const existing = await db.epubBooks.get(id);
              
              if (!existing) {
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
              }
              
              const newBook = await db.epubBooks.get(id);
              if (newBook) {
                handleOpenEpub(newBook);
              }
            }
          } catch (err) {
            console.error('Error handling launched file', err);
          }
        }
      });
    }
  }, []);

  // If an EPUB book is open, show the EPUB chapter reader
  if (currentEpub && epubChapters.length > 0) {
    return (
      <EpubChapterReader
        book={currentEpub}
        chapters={epubChapters}
        settings={settings}
        onSetTheme={setTheme}
        onSetFontSize={setFontSize}
        onSetLineHeight={setLineHeight}
        onSetMaxWidth={setMaxWidth}
        onSetHPadding={setHPadding}
        onBack={() => { 
          if (window.history.state?.view === 'reader') {
            window.history.back();
          } else {
            setCurrentEpub(null); 
            setEpubChapters([]); 
          }
        }}
      />
    );
  }

  // If a bilingual book is open, show the bilingual reader
  if (currentBook) {
    return (
      <Reader
        book={currentBook}
        chapters={chapters}
        chapterContent={currentChapter}
        loading={loading}
        settings={settings}
        onSetTheme={setTheme}
        onSetFontSize={setFontSize}
        onSetLineHeight={setLineHeight}
        onSetMaxWidth={setMaxWidth}
        onSetHPadding={setHPadding}
        onGoToChapter={goToChapter}
        onGoToNextChapter={goToNextChapter}
        onGoToPrevChapter={goToPrevChapter}
        onBackToLibrary={() => {
          if (window.history.state?.view === 'reader') {
            window.history.back();
          } else {
            closeBook();
          }
        }}
        onUpdateProgress={updateProgress}
      />
    );
  }

  // Otherwise, show the library
  return (
    <Library
      books={books}
      loading={loading}
      onOpenBook={openBook}
      onOpenEpub={handleOpenEpub}
      settings={settings}
      onSetTheme={setTheme}
      onSetFontSize={setFontSize}
      onSetLineHeight={setLineHeight}
      onSetMaxWidth={setMaxWidth}
      onSetHPadding={setHPadding}
    />
  );
}

export default App;
