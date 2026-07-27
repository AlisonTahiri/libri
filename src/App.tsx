import { useState } from 'react';
import { useReader } from './hooks/useReader';
import { useReaderSettings } from './hooks/useReaderSettings';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { EpubReaderView } from './components/EpubReaderView';
import type { EpubBook } from './lib/db';

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

  // If an EPUB book is open, show the EPUB reader
  if (currentEpub) {
    return (
      <EpubReaderView
        book={currentEpub}
        settings={settings}
        onSetTheme={setTheme}
        onSetFontSize={setFontSize}
        onSetLineHeight={setLineHeight}
        onSetMaxWidth={setMaxWidth}
        onSetHPadding={setHPadding}
        onBack={() => setCurrentEpub(null)}
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
      onOpenEpub={setCurrentEpub}
    />
  );
}

export default App;
