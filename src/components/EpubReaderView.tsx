import { useState, useRef, useEffect, useCallback } from 'react';
import Epub, { Book, Rendition } from 'epubjs';
import { Settings, ChevronLeft } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { ChapterNav } from './ChapterNav';
import { useFullscreen } from '../hooks/useFullscreen';
import type { ReaderSettings, Theme, Chapter } from '../types';
import type { EpubBook } from '../lib/db';
import { db } from '../lib/db';

interface EpubReaderViewProps {
  book: EpubBook;
  settings: ReaderSettings;
  onSetTheme: (theme: Theme) => void;
  onSetFontSize: (s: number) => void;
  onSetLineHeight: (lh: number) => void;
  onSetMaxWidth: (mw: number) => void;
  onSetHPadding: (hp: number) => void;
  onBack: () => void;
}

export function EpubReaderView({
  book,
  settings,
  onSetTheme,
  onSetFontSize,
  onSetLineHeight,
  onSetMaxWidth,
  onSetHPadding,
  onBack,
}: EpubReaderViewProps) {
  const [location, setLocation] = useState<string | number>(book.lastLocation || 0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  
  const [uiVisible, setUiVisible] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string>('');

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const settingsRef = useRef(settings);

  // Touch tracking for swipe inside iframe
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Keep ref in sync for event listeners
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const applyTheme = useCallback((rendition: Rendition, currentSettings: ReaderSettings) => {
    const isDark = currentSettings.theme === 'dark';
    const isSepia = currentSettings.theme === 'sepia';
    
    let bg = '#FFFFFF';
    let color = '#111827';
    let linkColor = '#2563EB';
    let selectionBg = 'rgba(0,0,0,0.1)';

    if (isDark) {
      bg = '#111827';
      color = '#F3F4F6';
      linkColor = '#60A5FA';
      selectionBg = 'rgba(255,255,255,0.2)';
    } else if (isSepia) {
      bg = '#f4ecd8';
      color = '#5b4636';
      linkColor = '#8b6914';
      selectionBg = 'rgba(139,105,20,0.18)';
    }

    rendition.themes.register(currentSettings.theme, {
      body: {
        background: `${bg} !important`,
        color: `${color} !important`,
        'font-family': 'Literata, Georgia, "Times New Roman", serif !important',
        'padding-left': '1.5rem !important',
        'padding-right': '1.5rem !important',
        'padding-top': '1rem !important',
        'padding-bottom': '1rem !important',
        'box-sizing': 'border-box !important',
        'user-select': 'none',
        '-webkit-user-select': 'none',
      },
      p: {
        'text-align': 'justify !important',
      },
      a: { color: linkColor },
      '::selection': { background: selectionBg },
    });

    rendition.themes.select(currentSettings.theme);
    rendition.themes.fontSize(`${currentSettings.fontSize}px`);
    rendition.themes.override('line-height', `${currentSettings.lineHeight}`);
  }, []);

  // Update theme when settings prop changes
  useEffect(() => {
    if (renditionRef.current) {
      applyTheme(renditionRef.current, settings);
      try {
        (renditionRef.current as any).resize();
      } catch (_) { /* ignore if not ready */ }
    }
  }, [settings, applyTheme]);

  const handleNextPage = useCallback(() => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  }, []);

  // Mount epub.js in PAGINATED mode
  useEffect(() => {
    if (!viewerRef.current) return;

    // Create book
    const newBook = Epub(book.fileData as any);
    bookRef.current = newBook;

    // Create rendition in paginated mode
    const rendition = newBook.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none',
    });
    renditionRef.current = rendition;

    // Initial theme
    applyTheme(rendition, settingsRef.current);

    // Register touch & click events inside the iframe for tap zones and swipe
    rendition.on('rendered', (_section: any, view: any) => {
      applyTheme(rendition, settingsRef.current);

      const doc = view.document;
      if (!doc) return;

      // Touch handlers for swipe & tap inside iframe
      doc.addEventListener('touchstart', (e: TouchEvent) => {
        const touch = e.touches[0];
        if (touch) {
          touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
          };
        }
      }, { passive: true });

      doc.addEventListener('touchend', (e: TouchEvent) => {
        if (!touchStartRef.current) return;
        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;
        touchStartRef.current = null;

        // Check if it's a swipe (fast enough & horizontal enough)
        if (deltaTime < 500 && Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          if (deltaX < 0) {
            // Swipe left -> Next Page
            rendition.next();
          } else {
            // Swipe right -> Prev Page
            rendition.prev();
          }
          return;
        }

        // If not swipe, check if it's a tap
        if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          const width = doc.documentElement.clientWidth || window.innerWidth;
          const clickX = touch.clientX;
          const leftZone = width * 0.3;
          const rightZone = width * 0.7;

          if (clickX < leftZone) {
            rendition.prev();
          } else if (clickX > rightZone) {
            rendition.next();
          } else {
            setUiVisible(prev => !prev);
          }
        }
      }, { passive: true });

      // Click handler (for desktop browsers)
      doc.addEventListener('click', (e: MouseEvent) => {
        // Prevent click handling if user is selecting text
        const selection = doc.getSelection();
        if (selection && selection.toString().length > 0) return;

        const width = doc.documentElement.clientWidth || window.innerWidth;
        const clickX = e.clientX;
        const leftZone = width * 0.3;
        const rightZone = width * 0.7;

        if (clickX < leftZone) {
          rendition.prev();
        } else if (clickX > rightZone) {
          rendition.next();
        } else {
          setUiVisible(prev => !prev);
        }
      });
    });

    // Handle location & progress tracking
    rendition.on('relocated', (loc: any) => {
      const cfi = loc.start.cfi;
      setLocation(cfi);
      db.epubBooks.update(book.id, { lastLocation: cfi }).catch(console.error);

      // Update progress percentage & page numbers if locations are ready
      if (newBook.locations && newBook.locations.length() > 0) {
        const pct = newBook.locations.percentageFromCfi(cfi);
        if (typeof pct === 'number') {
          setProgress(Math.round(pct * 100));
        }

        const currentLoc = loc.start.location;
        const totalLocs = newBook.locations.length();
        if (typeof currentLoc === 'number' && typeof totalLocs === 'number' && totalLocs > 0) {
          setPageInfo({ current: currentLoc + 1, total: totalLocs });
        }
      }

      // Find current chapter for header title
      setChapters(prev => {
        if (prev.length > 0 && loc.start.href) {
          const match = prev.slice().reverse().find(ch => loc.start.href.includes(ch.id));
          if (match && match.title) setCurrentChapterTitle(match.title);
        }
        return prev;
      });
    });

    // Extract TOC & Generate Locations
    newBook.loaded.navigation.then(nav => {
      const toc = nav.toc.map((item: any, i: number) => ({
        id: item.href,
        book_id: book.id,
        chapter_number: i + 1,
        title: item.label,
        created_at: new Date().toISOString(),
      }));
      setChapters(toc);
    });

    newBook.ready.then(() => {
      return newBook.locations.generate(1000);
    }).then(() => {
      // Refresh location percentage after location generation
      if (renditionRef.current) {
        const curLoc = renditionRef.current.currentLocation() as any;
        if (curLoc?.start?.cfi) {
          const pct = newBook.locations.percentageFromCfi(curLoc.start.cfi);
          if (typeof pct === 'number') setProgress(Math.round(pct * 100));
        }
      }
    }).catch(console.error);

    // Display book at saved location or start
    rendition.display(book.lastLocation || undefined);

    return () => {
      if (newBook) {
        newBook.destroy();
      }
    };
  }, [book.fileData, book.id, applyTheme]);

  const handleSelectChapter = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
      setChaptersOpen(false);
    }
  };

  // Outer container background matching theme
  const isDark = settings.theme === 'dark';
  const isSepia = settings.theme === 'sepia';
  const outerBg = isDark ? '#111827' : (isSepia ? '#f4ecd8' : '#FFFFFF');
  const textColor = isDark ? '#e5e7eb' : (isSepia ? '#5b4636' : '#111827');
  const mutedTextColor = isDark ? '#9ca3af' : (isSepia ? '#8b6914' : '#6b7280');
  const borderColor = isDark ? '#374151' : (isSepia ? '#d5c8a0' : '#e5e7eb');

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%', background: outerBg, overflow: 'hidden', userSelect: 'none' }}
    >
      {/* Reading Progress Bar (Top) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: 'var(--accent)',
          zIndex: 10,
          transition: 'width 0.3s ease',
        }} 
      />

      {/* Top Header Bar */}
      <header className="reader-header safe-top" style={{ 
        flexShrink: 0,
        zIndex: 5,
        background: outerBg,
        borderBottom: `1px solid ${borderColor}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transform: uiVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.25s ease',
        position: uiVisible ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            background: 'transparent',
            border: 'none',
            color: mutedTextColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--ui-font-family)',
            fontSize: '0.95rem',
            padding: '4px 8px',
            marginLeft: '-8px',
          }}
        >
          <ChevronLeft size={20} />
          Mbrapsht
        </button>

        <span 
          style={{ 
            color: textColor, 
            fontSize: '0.9rem',
            fontWeight: 500,
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentChapterTitle || book.title}
        </span>
        <div style={{ width: '40px' }} />
      </header>

      {/* Main EPUB Reader Viewer Container */}
      <div 
        style={{ 
          flexGrow: 1,
          position: 'relative',
          background: 'transparent',
          overflow: 'hidden',
        }} 
      >
        <div 
          ref={viewerRef} 
          style={{ 
            width: '100%',
            height: '100%',
          }}
        />

        {/* Desktop Navigation Hover Arrows */}
        <button
          onClick={handlePrevPage}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '5%',
            minWidth: '30px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 4,
          }}
          aria-label="Faqja e mëparshme"
        />

        <button
          onClick={handleNextPage}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '5%',
            minWidth: '30px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 4,
          }}
          aria-label="Faqja tjetër"
        />
      </div>

      {/* Bottom Status / Footer Bar */}
      <footer
        style={{
          flexShrink: 0,
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: mutedTextColor,
          borderTop: `1px solid ${borderColor}`,
          background: outerBg,
          zIndex: 5,
          transform: uiVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s ease',
          position: uiVisible ? 'relative' : 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {currentChapterTitle || book.title}
        </span>
        <span style={{ fontWeight: 600 }}>
          {pageInfo.total > 0
            ? `Faqja ${pageInfo.current} / ${pageInfo.total}`
            : (progress > 0 ? `${progress}%` : '')}
        </span>
      </footer>

      {/* FAB Settings Button */}
      <button
        className={`fab ${uiVisible ? '' : 'hidden'}`}
        onClick={(e) => {
          e.stopPropagation();
          setSettingsOpen(true);
        }}
        aria-label="Cilësimet"
        style={{ zIndex: 10, pointerEvents: 'auto' }}
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
        isEpub={true}
        onOpenChapters={() => {
          setSettingsOpen(false);
          setChaptersOpen(true);
        }}
        onBackToLibrary={onBack}
      />

      {/* Chapter Nav */}
      <ChapterNav
        open={chaptersOpen}
        onClose={() => setChaptersOpen(false)}
        chapters={chapters}
        currentChapterId={location.toString()}
        onSelectChapter={handleSelectChapter}
      />
    </div>
  );
}
