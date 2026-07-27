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
  
  const [fabVisible, setFabVisible] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterTitle, setCurrentChapterTitle] = useState<string>('');

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const fabTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const settingsRef = useRef(settings);

  // Keep ref in sync for event listeners
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    setFabVisible(true);
    if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    fabTimeoutRef.current = setTimeout(() => setFabVisible(false), 3000);
    return () => { if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current); };
  }, []);

  const handleTouch = () => {
    setFabVisible(true);
    if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    fabTimeoutRef.current = setTimeout(() => setFabVisible(false), 3000);
  };

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
        'margin': '0 auto !important',
        'padding-top': '1rem !important',
        'padding-bottom': '2rem !important',
      },
      p: {
        'text-align': 'left !important',
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
      // Force epub.js to recalculate layout with new CSS (padding, max-width)
      try {
        (renditionRef.current as any).resize();
      } catch (_) { /* ignore if not ready */ }
    }
  }, [settings, applyTheme]);

  // Mount epub.js
  useEffect(() => {
    if (!viewerRef.current) return;

    // Create book
    const newBook = Epub(book.fileData as any);
    bookRef.current = newBook;

    // Create rendition (one chapter at a time, scrollable)
    const rendition = newBook.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'scrolled-doc',
      spread: 'none',
      // We explicitly DO NOT use continuous manager so it renders chapter-by-chapter
      // manager: 'default' is the default
    });
    renditionRef.current = rendition;

    // Initial theme
    applyTheme(rendition, settingsRef.current);

    // Inject Prev/Next footer at the bottom of every chapter
    rendition.on('rendered', (section: any, view: any) => {
      applyTheme(rendition, settingsRef.current);

      const doc = view.document;
      if (!doc) return;

      const isDark = settingsRef.current.theme === 'dark';
      const borderColor = isDark ? '#374151' : '#e5e7eb';
      const accentColor = isDark ? '#60A5FA' : '#2563EB';

      const footerHtml = `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4rem auto 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${borderColor};
          max-width: ${settingsRef.current.maxWidth}px;
        ">
          <button id="btn-epub-prev" style="
            display: flex; align-items: center; gap: 0.4rem;
            padding: 0.6rem 1rem; border-radius: 8px;
            border: 1px solid ${borderColor};
            background: transparent; color: ${accentColor};
            font-family: inherit; font-size: 0.85rem; cursor: pointer;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Para
          </button>
          
          <span id="btn-epub-top" style="
            font-size: 0.8rem; color: ${isDark ? '#9ca3af' : '#6b7280'}; cursor: pointer; text-decoration: underline;
          ">
            Lart
          </span>

          <button id="btn-epub-next" style="
            display: flex; align-items: center; gap: 0.4rem;
            padding: 0.6rem 1rem; border-radius: 8px;
            border: 1px solid ${borderColor};
            background: transparent; color: ${accentColor};
            font-family: inherit; font-size: 0.85rem; cursor: pointer;
          ">
            Pas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      `;

      // Remove old footer if exists (just in case)
      const oldFooter = doc.getElementById('epub-custom-footer');
      if (oldFooter) oldFooter.remove();

      const footer = doc.createElement('div');
      footer.id = 'epub-custom-footer';
      footer.innerHTML = footerHtml;
      doc.body.appendChild(footer);

      // Event listeners
      doc.getElementById('btn-epub-prev').onclick = () => {
        rendition.prev().then(() => {
          // Scroll to bottom of the previous chapter
          setTimeout(() => {
            const currentView = rendition.manager?.views?._views[0];
            if (currentView && currentView.document) {
              const body = currentView.document.body;
              const html = currentView.document.documentElement;
              const maxScroll = Math.max(body.scrollHeight, html.scrollHeight) - currentView.document.defaultView.innerHeight;
              currentView.document.defaultView.scrollTo(0, maxScroll);
            }
          }, 100); // small delay to allow DOM render
        });
      };

      doc.getElementById('btn-epub-next').onclick = () => {
        rendition.next().then(() => {
          // ensure top
          setTimeout(() => {
            const currentView = rendition.manager?.views?._views[0];
            if (currentView && currentView.document) {
              currentView.document.defaultView.scrollTo(0, 0);
            }
          }, 50);
        });
      };

      doc.getElementById('btn-epub-top').onclick = () => {
        view.document.defaultView.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });

    // Handle location tracking
    rendition.on('relocated', (loc: any) => {
      const cfi = loc.start.cfi;
      setLocation(cfi);
      db.epubBooks.update(book.id, { lastLocation: cfi }).catch(console.error);

      // Find current chapter for header title
      setChapters(prev => {
        if (prev.length > 0 && loc.start.href) {
          const match = prev.slice().reverse().find(ch => loc.start.href.includes(ch.id));
          if (match) setCurrentChapterTitle(match.title);
        }
        return prev;
      });
    });

    // Extract TOC
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

    // Display book at saved location or start
    rendition.display(book.lastLocation || undefined);

    return () => {
      if (newBook) {
        newBook.destroy();
      }
    };
  }, [book.fileData, book.id]); // Removed applyTheme and book.lastLocation to prevent remounting

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

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%', background: outerBg, overflow: 'hidden' }}
      onTouchStart={handleTouch}
      onClick={handleTouch}
    >
      {/* Custom Top Bar */}
      <header className="reader-header safe-top" style={{ 
        flexShrink: 0,
        zIndex: 2,
        background: outerBg,
        borderBottom: `1px solid ${isDark ? '#374151' : (isSepia ? '#d5c8a0' : '#e5e7eb')}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#9ca3af' : (isSepia ? '#8b6914' : '#4b5563'),
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
            color: isDark ? '#e5e7eb' : (isSepia ? '#5b4636' : '#111827'), 
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
        <div style={{ width: '40px' }} /> {/* Spacer for balance */}
      </header>

      {/* Pure epub.js Container */}
      <div 
        ref={viewerRef} 
        style={{ 
          flexGrow: 1,
          position: 'relative',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'transparent',
        }} 
      />

      {/* FAB */}
      <button
        className={`fab ${fabVisible ? '' : 'hidden'}`}
        onClick={(e) => {
          e.stopPropagation();
          setSettingsOpen(true);
          setFabVisible(true);
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

      {/* epub.js internal layout fixes */}
      <style>{`
        .epub-container {
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        .epub-view {
          overflow: visible !important;
        }
        .epub-view iframe {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}
