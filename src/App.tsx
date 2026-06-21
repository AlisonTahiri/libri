import { useReader } from './hooks/useReader';
import { useReaderSettings } from './hooks/useReaderSettings';
import { Library } from './components/Library';
import { Reader } from './components/Reader';

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

  // If a book is open, show the reader
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
    />
  );
}

export default App;
