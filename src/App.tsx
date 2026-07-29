import { useState } from 'react';
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

  const handleOpenEpub = async (book: EpubBook) => {
    const chs = await db.epubChapters
      .where('bookId').equals(book.id)
      .sortBy('orderIndex');
    setEpubChapters(chs);
    setCurrentEpub(book);
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
        onBack={() => { setCurrentEpub(null); setEpubChapters([]); }}
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
        onBackToLibrary={closeBook}
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
