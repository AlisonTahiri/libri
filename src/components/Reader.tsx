import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { ReaderContent } from './ReaderContent';
import { TranslationTooltip } from './TranslationTooltip';
import { SettingsPanel } from './SettingsPanel';
import { ChapterNav } from './ChapterNav';
import { useTooltip } from '../hooks/useTooltip';
import { useFullscreen } from '../hooks/useFullscreen';
import { useLanguage } from '../hooks/useLanguage';
import type { Book, Chapter, ChapterContent, ReaderSettings, Theme } from '../types';
import { saveReadingProgress, getReadingProgress } from '../services/bookService';

interface ReaderProps {
  book: Book;
  chapters: Chapter[];
  chapterContent: ChapterContent | null;
  loading: boolean;
  settings: ReaderSettings;
  onSetTheme: (theme: Theme) => void;
  onSetFontSize: (s: number) => void;
  onSetLineHeight: (lh: number) => void;
  onSetMaxWidth: (mw: number) => void;
  onSetHPadding: (hp: number) => void;
  onGoToChapter: (chapterId: string) => void;
  onGoToNextChapter: () => void;
  onGoToPrevChapter: () => void;
  onBackToLibrary: () => void;
  onUpdateProgress: (paragraphIndex: number) => void;
}

export function Reader({
  book: _book,
  chapters,
  chapterContent,
  loading,
  settings,
  onSetTheme,
  onSetFontSize,
  onSetLineHeight,
  onSetMaxWidth,
  onSetHPadding,
  onGoToChapter,
  onGoToNextChapter,
  onGoToPrevChapter,
  onBackToLibrary,
  onUpdateProgress,
}: ReaderProps) {
  const { t } = useLanguage();
  const { tooltip, tooltipRef, showTooltip, hideTooltip } = useTooltip();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollY = useRef(0);
  const fabTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<'top' | 'bottom' | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleGoToPrev = () => {
    pendingScrollRef.current = 'bottom';
    onGoToPrevChapter();
  };

  const handleGoToNext = () => {
    pendingScrollRef.current = 'top';
    onGoToNextChapter();
  };

  // Swipe left/right to navigate chapters (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;
    // Horizontal swipe: fast, mostly horizontal, > 60px
    if (dt < 400 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      if (dx < 0 && hasNext) handleGoToNext();
      else if (dx > 0 && hasPrev) handleGoToPrev();
    }
  };

  const handleGoToChapter = (id: string) => {
    pendingScrollRef.current = 'top';
    onGoToChapter(id);
  };

  useEffect(() => {
    if (!chapterContent) return;
    
    // Use setTimeout to ensure DOM has fully updated and layout is calculated
    setTimeout(() => {
      const progress = getReadingProgress(_book.id);
      
      if (pendingScrollRef.current === 'bottom') {
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else if (progress?.chapter_id === chapterContent.chapter.id && progress?.scroll_position) {
        window.scrollTo(0, progress.scroll_position);
      } else {
        window.scrollTo(0, 0);
      }
      pendingScrollRef.current = null;
    }, 50);
  }, [chapterContent?.chapter.id, _book.id]);

  // Save progress periodically and on unmount/unload
  useEffect(() => {
    if (!chapterContent || !_book) return;
    
    const savePosition = () => {
      saveReadingProgress(_book.id, chapterContent.chapter.id, 0, window.scrollY);
    };

    const interval = setInterval(savePosition, 30000); // 30 seconds
    
    const handleBeforeUnload = () => savePosition();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [_book, chapterContent]);

  // Handle sentence tap
  const handleSentenceTap = useCallback(
    (id: string, translation: string, element: HTMLElement) => {
      if (tooltip.sentenceId === id) {
        hideTooltip();
      } else {
        showTooltip(id, translation, element);
      }
    },
    [tooltip.sentenceId, showTooltip, hideTooltip]
  );

  // Scroll handler: hide/show header + FAB, track progress
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (currentY / maxScroll) * 100 : 0;

      setScrollProgress(Math.min(100, progress));

      // Hide header on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 80) {
        setHeaderHidden(true);
        setFabVisible(false);
      } else {
        setHeaderHidden(false);
        setFabVisible(true);
      }

      lastScrollY.current = currentY;

      // Auto-hide FAB after 3 seconds
      if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
      fabTimeoutRef.current = setTimeout(() => {
        if (window.scrollY > 80) setFabVisible(false);
      }, 3000);

      // Track reading progress (estimate paragraph by scroll percentage)
      if (chapterContent) {
        const totalParagraphs = chapterContent.paragraphs.length;
        const estimatedParagraph = Math.floor((progress / 100) * totalParagraphs);
        onUpdateProgress(estimatedParagraph);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    };
  }, [chapterContent, onUpdateProgress]);

  // Show FAB when user taps in the bottom-right corner area
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const x = touch.clientX;
      const y = touch.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Bottom-right quadrant
      if (x > w * 0.7 && y > h * 0.7) {
        setFabVisible(true);
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  const currentChapterNum = chapterContent?.chapter.chapter_number ?? 0;
  const hasPrev = currentChapterNum > 1;
  const hasNext = chapters.some((c) => c.chapter_number > currentChapterNum);

  if (loading && !chapterContent) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-background">
        <div className="w-9 h-9 border-[3px] border-outline-variant/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className="min-h-[100dvh] bg-background pb-16"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center h-[3px] bg-transparent">
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, height: '100%', position: 'relative' }}>
          <div className="absolute top-0 left-0 h-full bg-primary rounded-r-[2px] transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
      </div>

      <header className={`sticky top-0 z-[90] bg-surface/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm pt-[max(0.5rem,env(safe-area-inset-top))] transition-all duration-300 ${headerHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div 
          className="mx-auto flex items-center justify-between w-full box-border"
          style={{ maxWidth: `${settings.maxWidth}px`, padding: `10px ${settings.hPadding}rem` }}
        >
          <button
            onClick={() => {
              if (_book && chapterContent) {
                saveReadingProgress(_book.id, chapterContent.chapter.id, 0, window.scrollY);
              }
              onBackToLibrary();
            }}
            className="flex items-center gap-1 bg-transparent border-none text-on-surface-variant cursor-pointer font-ui-button text-sm py-1 px-2 -ml-2 rounded-md hover:bg-surface-variant/30 transition-colors"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
            {t('back')}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setChaptersOpen(true);
            }}
            className="flex flex-col items-end max-w-[70%] overflow-hidden text-right font-ui-header bg-transparent border-none cursor-pointer p-0"
            aria-label="Ndërro kapitullin"
          >
            <div className="text-sm font-semibold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {_book.title}
            </div>
            {chapterContent && (
              <div className="text-xs font-normal text-on-surface-variant italic whitespace-nowrap overflow-hidden text-ellipsis w-full mt-0.5 flex items-center justify-end gap-1">
                {t('chapter')} {currentChapterNum}: {chapterContent.chapter.title}
                <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Chapter Title */}
      {chapterContent && (
        <div 
          className="text-center pt-10 px-6 pb-4 mx-auto"
          style={{ maxWidth: `${settings.maxWidth}px` }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 font-ui-label-sm">
            Kapitulli {currentChapterNum}
          </p>
          {chapterContent.chapter.title && (
            <h2 className="font-display-reading text-2xl font-semibold text-on-surface m-0 leading-snug">
              {chapterContent.chapter.title}
            </h2>
          )}
        </div>
      )}

      {/* Content */}
      {chapterContent && (
        <ReaderContent
          paragraphs={chapterContent.paragraphs}
          activeSentenceId={tooltip.sentenceId}
          onSentenceTap={handleSentenceTap}
        />
      )}

      {/* Chapter Navigation Footer */}
      {chapterContent && (
        <div 
          className="flex justify-between items-center mt-8 mx-auto"
          style={{ maxWidth: `${settings.maxWidth}px`, padding: `0 ${settings.hPadding}rem` }}
        >
          <button
            onClick={handleGoToPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('prev')}
          </button>

          <span className="text-xs text-on-surface-variant font-ui-label-sm oldstyle-nums">
            {currentChapterNum} / {chapters.length}
          </span>

          <button
            onClick={handleGoToNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Translation Tooltip */}
      <TranslationTooltip
        ref={tooltipRef}
        visible={tooltip.visible}
        text={tooltip.text}
        x={tooltip.x}
        y={tooltip.y}
        above={tooltip.above}
      />

      {/* FAB Settings */}
      <div className="fixed bottom-0 left-0 right-0 z-15 pointer-events-none flex justify-center">
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, position: 'relative' }}>
          <button
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant shadow-md hover:bg-outline-variant/30 transition-all ${fabVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSettingsOpen(true)}
            aria-label="Cilësimet"
            style={{ position: 'absolute', bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))', right: `${settings.hPadding}rem`, pointerEvents: 'auto' }}
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSetTheme={onSetTheme}
        onSetFontSize={onSetFontSize}
        onSetLineHeight={onSetLineHeight}
        onSetMaxWidth={onSetMaxWidth}
        onSetHPadding={onSetHPadding}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Chapter Nav */}
      <ChapterNav
        open={chaptersOpen}
        onClose={() => setChaptersOpen(false)}
        chapters={chapters}
        currentChapterId={chapterContent?.chapter.id ?? null}
        onSelectChapter={handleGoToChapter}
      />
    </div>
  );
}
