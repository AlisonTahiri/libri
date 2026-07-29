import { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { ChapterNav } from './ChapterNav';
import { useFullscreen } from '../hooks/useFullscreen';
import type { ReaderSettings, Theme, Chapter } from '../types';
import type { EpubBook, EpubChapter } from '../lib/db';
import { db } from '../lib/db';

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
  const [initialScrollRestored, setInitialScrollRestored] = useState(false);

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const uiHideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollY = useRef(0);

  const chapter = chapters[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < chapters.length - 1;

  // Persist last chapter index
  useEffect(() => {
    db.epubBooks.update(book.id, { lastChapterIndex: currentIndex }).catch(console.error);
  }, [book.id, currentIndex]);

  // Scroll to saved position or top when chapter changes
  useEffect(() => {
    setTimeout(() => {
      if (!initialScrollRestored && currentIndex === book.lastChapterIndex && book.lastScrollPosition) {
        window.scrollTo({ top: book.lastScrollPosition, behavior: 'instant' });
        setInitialScrollRestored(true);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 50); // slight delay to let content render
  }, [currentIndex, book.lastChapterIndex, book.lastScrollPosition, initialScrollRestored]);

  // Persist scroll position periodically
  useEffect(() => {
    const interval = setInterval(() => {
      db.epubBooks.update(book.id, { lastScrollPosition: window.scrollY }).catch(console.error);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
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
    if (hasNext) setCurrentIndex(i => i + 1);
  }, [hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) setCurrentIndex(i => i - 1);
  }, [hasPrev]);

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

  // Tap center to toggle UI
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const w = window.innerWidth;
    if (x > w * 0.25 && x < w * 0.75) {
      setUiVisible(v => !v);
      // Clear any pending hide timer
      if (uiHideTimerRef.current) clearTimeout(uiHideTimerRef.current);
    }
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
  const borderColor = isDark ? '#374151' : isSepia ? '#d5c8a0' : '#e5e7eb';

  return (
    <div style={{ minHeight: '100dvh', background: bg }}>

      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Header */}
      <header
        className="reader-header safe-top"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
          background: bg, borderBottom: `1px solid ${borderColor}`,
          transform: uiVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <div style={{
          maxWidth: '780px', margin: '0 auto',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            style={{
              background: 'transparent', border: 'none',
              color: mutedColor, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--ui-font-family)', fontSize: '0.9rem',
              padding: '4px 8px', marginLeft: '-8px', borderRadius: '6px',
            }}
          >
            <ChevronLeft size={18} />
            Mbrapsht
          </button>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            maxWidth: '70%', overflow: 'hidden', textAlign: 'right',
            fontFamily: 'var(--ui-font-family)',
          }}>
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
                width: '100%', marginTop: '2px',
              }}>
                Kapitulli {currentIndex + 1}: {chapter.title}
              </div>
            )}
          </div>
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
        {/* Chapter title */}
        {chapter && (
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
        )}

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
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.6rem 1rem', borderRadius: '8px',
                border: `1px solid ${borderColor}`, background: 'transparent',
                color: hasPrev ? 'var(--accent)' : mutedColor,
                fontFamily: 'var(--ui-font-family)', fontSize: '0.85rem',
                cursor: hasPrev ? 'pointer' : 'default', opacity: hasPrev ? 1 : 0.4,
              }}
            >
              <ChevronLeft size={16} />
              Para
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
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.6rem 1rem', borderRadius: '8px',
                border: `1px solid ${borderColor}`, background: 'transparent',
                color: hasNext ? 'var(--accent)' : mutedColor,
                fontFamily: 'var(--ui-font-family)', fontSize: '0.85rem',
                cursor: hasNext ? 'pointer' : 'default', opacity: hasNext ? 1 : 0.4,
              }}
            >
              Pas
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* FAB Settings */}
      <button
        className={`fab ${uiVisible ? '' : 'hidden'}`}
        onClick={(e) => { e.stopPropagation(); setSettingsOpen(true); }}
        aria-label="Cilësimet"
        style={{ zIndex: 15 }}
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
        onOpenChapters={() => { setSettingsOpen(false); setChaptersOpen(true); }}
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
