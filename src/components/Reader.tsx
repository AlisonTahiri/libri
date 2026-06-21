import { useState, useCallback, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import { ReaderContent } from './ReaderContent';
import { TranslationTooltip } from './TranslationTooltip';
import { SettingsPanel } from './SettingsPanel';
import { ChapterNav } from './ChapterNav';
import { useTooltip } from '../hooks/useTooltip';
import { useFullscreen } from '../hooks/useFullscreen';
import type { Book, Chapter, ChapterContent, ReaderSettings, Theme } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const handleGoToPrev = () => {
    pendingScrollRef.current = 'bottom';
    onGoToPrevChapter();
  };

  const handleGoToNext = () => {
    pendingScrollRef.current = 'top';
    onGoToNextChapter();
  };

  const handleGoToChapter = (id: string) => {
    pendingScrollRef.current = 'top';
    onGoToChapter(id);
  };

  useEffect(() => {
    if (!chapterContent) return;
    
    // Use setTimeout to ensure DOM has fully updated and layout is calculated
    setTimeout(() => {
      if (pendingScrollRef.current === 'bottom') {
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else {
        window.scrollTo(0, 0);
      }
      pendingScrollRef.current = null;
    }, 50);
  }, [chapterContent?.chapter.id]);

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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        background: 'var(--reader-bg)',
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
    <div
      ref={contentRef}
      style={{
        minHeight: '100dvh',
        background: 'var(--reader-bg)',
        paddingBottom: '4rem',
      }}
    >
      {/* Reading Progress Bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Header */}
      <header className={`reader-header safe-top ${headerHidden ? 'hidden' : ''}`}>
        <button
          onClick={onBackToLibrary}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--ui-font-family)',
            fontSize: '0.85rem',
          }}
        >
          <ChevronLeft size={18} />
          Libri
        </button>

        <span className="reader-header-title">
          {chapterContent?.chapter.title || `Kapitulli ${currentChapterNum}`}
        </span>

        <div style={{ width: 60 }} /> {/* Spacer for centering */}
      </header>

      {/* Chapter Title */}
      {chapterContent && (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem 1rem',
          maxWidth: 'var(--reader-max-width)',
          margin: '0 auto',
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
            fontFamily: 'var(--ui-font-family)',
          }}>
            Kapitulli {currentChapterNum}
          </p>
          {chapterContent.chapter.title && (
            <h2 style={{
              fontFamily: 'var(--reader-font-family)',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.35,
            }}>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 'var(--reader-max-width)',
          margin: '2rem auto 0',
          padding: '0 var(--reader-h-padding)',
        }}>
          <button
            onClick={handleGoToPrev}
            disabled={!hasPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: hasPrev ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--ui-font-family)',
              fontSize: '0.85rem',
              cursor: hasPrev ? 'pointer' : 'default',
              opacity: hasPrev ? 1 : 0.4,
            }}
          >
            <ChevronLeft size={16} />
            Para
          </button>

          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--ui-font-family)',
            fontVariantNumeric: 'oldstyle-nums',
          }}>
            {currentChapterNum} / {chapters.length}
          </span>

          <button
            onClick={handleGoToNext}
            disabled={!hasNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: hasNext ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--ui-font-family)',
              fontSize: '0.85rem',
              cursor: hasNext ? 'pointer' : 'default',
              opacity: hasNext ? 1 : 0.4,
            }}
          >
            Pas
            <ChevronRight size={16} />
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

      {/* FAB */}
      <button
        className={`fab ${fabVisible ? '' : 'hidden'}`}
        onClick={() => {
          setSettingsOpen(true);
          setFabVisible(true);
        }}
        aria-label="Cilësimet"
      >
        <Settings size={20} />
      </button>

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
        onOpenChapters={() => setChaptersOpen(true)}
        onBackToLibrary={onBackToLibrary}
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
