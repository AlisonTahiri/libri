import { useState, useCallback, useEffect, useRef } from 'react';
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center h-[3px] bg-transparent">
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, height: '100%', position: 'relative' }}>
          <div className="absolute top-0 left-0 h-full bg-primary rounded-r-[2px] transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
      </div>

      <header className={`reader-header safe-top ${headerHidden ? 'hidden' : ''}`}>
        <div style={{
          maxWidth: `${settings.maxWidth}px`, margin: '0 auto',
          padding: `10px ${settings.hPadding}rem`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', boxSizing: 'border-box',
        }}>
          <button
            onClick={() => {
              if (_book && chapterContent) {
                saveReadingProgress(_book.id, chapterContent.chapter.id, 0, window.scrollY);
              }
              onBackToLibrary();
            }}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--ui-font-family)', fontSize: '0.85rem',
              padding: '4px 8px', marginLeft: '-8px', borderRadius: '6px',
            }}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            {t('back')}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setChaptersOpen(true);
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              maxWidth: '70%', overflow: 'hidden', textAlign: 'right',
              fontFamily: 'var(--ui-font-family)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            }}
            aria-label="Ndërro kapitullin"
          >
            <div style={{
              fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
              whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
              width: '100%',
            }}>
              {_book.title}
            </div>
            {chapterContent && (
              <div style={{
                fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', fontStyle: 'italic',
                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                width: '100%', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end'
              }}>
                {t('chapter')} {currentChapterNum}: {chapterContent.chapter.title}
                <span className="material-symbols-outlined text-[12px] rotate-[-90deg]">chevron_left</span>
              </div>
            )}
          </button>
        </div>
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
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            {t('prev')}
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
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
          >
            {t('next')}
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
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
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 15,
        pointerEvents: 'none', display: 'flex', justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, position: 'relative' }}>
          <button
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant shadow-md hover:bg-outline-variant/30 transition-all ${fabVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSettingsOpen(true)}
            aria-label="Cilësimet"
            style={{ position: 'absolute', bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))', right: `${settings.hPadding}rem`, pointerEvents: 'auto' }}
          >
            <span className="material-symbols-outlined text-[24px]">settings</span>
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
