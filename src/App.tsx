import { useState, useEffect } from 'react';
import { useReader } from './hooks/useReader';
import { useReaderSettings } from './hooks/useReaderSettings';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { EpubChapterReader } from './components/EpubChapterReader';
import { db, type EpubBook, type EpubChapter } from './lib/db';

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
