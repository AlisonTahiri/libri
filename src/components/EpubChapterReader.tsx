import { useState, useRef, useEffect, useCallback } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { ChapterNav } from './ChapterNav';
import { useFullscreen } from '../hooks/useFullscreen';
import type { ReaderSettings, Theme, Chapter } from '../types';
import { db, type EpubBook, type EpubChapter } from '../lib/db';
import { useLanguage } from '../hooks/useLanguage';

interface EpubChapterReaderProps {
  book: EpubBook;
  chapters: EpubChapter[];
  settings: ReaderSettings;
  onSetTheme: (theme: Theme) => void;
  onSetFontSize: (s: number) => void;
  onSetLineHeight: (lh: number) => void;
  onSetMaxWidth: (mw: number) => void;
  onSetHPadding: (hp: number) => void;
  onBack: () => void;
}

export function EpubChapterReader({
  book,
  chapters,
  settings,
  onSetTheme,
  onSetFontSize,
  onSetLineHeight,
  onSetMaxWidth,
  onSetHPadding,
  onBack,
}: EpubChapterReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(book.lastChapterIndex ?? 0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { t } = useLanguage();

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const uiHideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollY = useRef(0);
  
  const isFirstRender = useRef(true);
  const initialChapterIndex = useRef(book.lastChapterIndex);
  const initialScrollPos = useRef(book.lastScrollPosition);

  const chapter = chapters[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;

  // Persist last chapter index
  useEffect(() => {
    db.epubBooks.update(book.id, { lastChapterIndex: currentIndex }).catch(console.error);
  }, [book.id, currentIndex]);

  // Scroll to saved position or top when chapter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (currentIndex === initialChapterIndex.current && initialScrollPos.current) {
          window.scrollTo({ top: initialScrollPos.current, behavior: 'instant' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 100); // 100ms delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Persist scroll position periodically and on unmount/unload
  useEffect(() => {
    const savePosition = () => {
      db.epubBooks.update(book.id, { lastScrollPosition: window.scrollY }).catch(console.error);
    };

    const interval = setInterval(savePosition, 30000); // 30 seconds
    
    const handleBeforeUnload = () => savePosition();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [book.id]);

  // Track scroll progress + hide/show UI
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min(100, (currentY / maxScroll) * 100) : 0;
      setScrollProgress(pct);

      // Hide UI on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 60) {
        setUiVisible(false);
      } else if (currentY < lastScrollY.current) {
        setUiVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goNext = useCallback(() => {
    if (hasNext) {
      db.epubBooks.update(book.id, { lastScrollPosition: 0 }).catch(console.error);
      setCurrentIndex(i => i + 1);
    }
  }, [hasNext, book.id]);

  const goPrev = useCallback(() => {
    if (hasPrev) {
      db.epubBooks.update(book.id, { lastScrollPosition: 0 }).catch(console.error);
      setCurrentIndex(i => i - 1);
    }
  }, [hasPrev, book.id]);

  // Swipe detection (on the content area, not the scroll container)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Horizontal swipe: fast, mostly horizontal, > 60px
    if (dt < 400 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Tap zone: Any click toggles UI, unless it's a link or selection
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    // If it's an internal link, scroll to it instead of navigating
    if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      const id = anchor.getAttribute('href')?.substring(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Only toggle UI if the click wasn't part of a selection
    if (window.getSelection()?.toString().length) return;
    
    setUiVisible(v => !v);
    // Clear any pending hide timer
    if (uiHideTimerRef.current) clearTimeout(uiHideTimerRef.current);
  }, []);

  // Build chapter nav items in the format ChapterNav expects
  const navChapters: Chapter[] = chapters.map((ch, i) => ({
    id: ch.id,
    book_id: book.id,
    chapter_number: i + 1,
    title: ch.title,
    created_at: '',
  }));

  // Colors derived from theme
  const isDark = settings.theme === 'dark';
  const isSepia = settings.theme === 'sepia';
  const bg = isDark ? '#111827' : isSepia ? '#f4ecd8' : '#FFFFFF';
  const textColor = isDark ? '#F3F4F6' : isSepia ? '#5b4636' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : isSepia ? '#8b6914' : '#6b7280';

  return (
    <div style={{ minHeight: '100dvh', background: bg }}>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center h-[3px] bg-transparent">
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, height: '100%', position: 'relative' }}>
          <div className="absolute top-0 left-0 h-full bg-primary rounded-r-[2px] transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm safe-top transition-all duration-300 ${uiVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div style={{
          maxWidth: `${settings.maxWidth}px`, margin: '0 auto',
          padding: `10px ${settings.hPadding}rem`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', boxSizing: 'border-box'
        }}>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              db.epubBooks.update(book.id, { lastScrollPosition: window.scrollY }).catch(console.error);
              onBack(); 
            }}
            style={{
              background: 'transparent', border: 'none',
              color: mutedColor, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--ui-font-family)', fontSize: '0.9rem',
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
              fontSize: '0.85rem', fontWeight: 600, color: textColor,
              whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
              width: '100%',
            }}>
              {book.title}
            </div>
            {chapter && (
              <div style={{
                fontSize: '0.75rem', fontWeight: 400, color: mutedColor, fontStyle: 'italic',
                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                width: '100%', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end'
              }}>
                {t('chapter')} {currentIndex + 1}: {chapter.title}
                <span className="material-symbols-outlined text-[12px] rotate-[-90deg]">chevron_left</span>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main content — scrollable */}
      <div
        ref={contentRef}
        style={{
          paddingTop: '64px',   // header height
          paddingBottom: '80px', // footer height
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleContentClick}
      >
        {/* Chapter title (Hidden for EPUBs because the HTML content usually contains its own title) */}
        {/* {chapter && (
          <div style={{
            maxWidth: `${settings.maxWidth}px`, margin: '0 auto',
            padding: `2rem ${settings.hPadding}rem 0.5rem`,
          }}>
            <p style={{
              fontSize: '0.72rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: mutedColor, marginBottom: '0.5rem',
              fontFamily: 'var(--ui-font-family)',
            }}>
              {currentIndex + 1} / {chapters.length}
            </p>
            <h2 style={{
              fontFamily: 'Literata, Georgia, "Times New Roman", serif',
              fontSize: `${Math.round(settings.fontSize * 1.3)}px`,
              fontWeight: 700, color: textColor,
              margin: 0, lineHeight: 1.3,
            }}>
              {chapter.title}
            </h2>
          </div>
        )} */}

        {/* Chapter body */}
        {chapter && (
          <div
            className="epub-chapter-content"
            style={{
              maxWidth: `${settings.maxWidth}px`, margin: '0 auto',
              padding: `1.5rem ${settings.hPadding}rem 2rem`,
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              color: textColor,
              fontFamily: 'Literata, Georgia, "Times New Roman", serif',
            }}
            dangerouslySetInnerHTML={{ __html: chapter.htmlContent }}
          />
        )}

        {/* Chapter navigation footer */}
        {chapter && (
          <div style={{
            maxWidth: `${settings.maxWidth}px`, margin: '0 auto 2rem',
            padding: `0 ${settings.hPadding}rem`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              disabled={!hasPrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              {t('prev')}
            </button>

            <span style={{
              fontSize: '0.75rem', color: mutedColor,
              fontFamily: 'var(--ui-font-family)',
            }}>
              {currentIndex + 1} / {chapters.length}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              disabled={!hasNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-transparent text-on-surface hover:bg-surface-variant/30 transition-colors disabled:opacity-40 disabled:cursor-default font-ui-button text-ui-button"
            >
              {t('next')}
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* FAB Settings */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 15,
        pointerEvents: 'none', display: 'flex', justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: `${settings.maxWidth}px`, position: 'relative' }}>
          <button
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant shadow-md hover:bg-outline-variant/30 transition-all ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }}
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
        onBackToLibrary={onBack}
      />

      {/* Chapter Nav */}
      <ChapterNav
        open={chaptersOpen}
        onClose={() => setChaptersOpen(false)}
        chapters={navChapters}
        currentChapterId={chapter?.id ?? null}
        onSelectChapter={(id) => {
          const idx = chapters.findIndex(ch => ch.id === id);
          if (idx !== -1) setCurrentIndex(idx);
          setChaptersOpen(false);
        }}
      />
    </div>
  );
}
