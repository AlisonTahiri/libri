import { useState, useRef, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import type { Rendition } from 'epubjs';
import { Settings, ChevronLeft } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { useFullscreen } from '../hooks/useFullscreen';
import type { ReaderSettings, Theme } from '../types';
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
  const [fabVisible, setFabVisible] = useState(true);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const renditionRef = useRef<Rendition | null>(null);

  // Auto-hide FAB timeout
  const fabTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Show FAB initially, hide after a few seconds
    setFabVisible(true);
    if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    fabTimeoutRef.current = setTimeout(() => {
      setFabVisible(false);
    }, 3000);

    return () => {
      if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    };
  }, []);

  const handleTouch = () => {
    setFabVisible(true);
    if (fabTimeoutRef.current) clearTimeout(fabTimeoutRef.current);
    fabTimeoutRef.current = setTimeout(() => {
      setFabVisible(false);
    }, 3000);
  };

  const handleLocationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
    // Save to indexedDB
    db.epubBooks.update(book.id, { lastLocation: epubcifi }).catch(console.error);
  };

  const updateTheme = (rendition: Rendition, currentTheme: Theme) => {
    const isDark = currentTheme === 'dark';
    const bg = isDark ? '#111827' : '#FFFFFF';
    const color = isDark ? '#F3F4F6' : '#111827';
    const linkColor = isDark ? '#60A5FA' : '#2563EB';

    rendition.themes.register(currentTheme, {
      body: {
        background: bg,
        color: color,
        'font-family': 'Inter, sans-serif !important',
      },
      a: {
        color: linkColor,
      },
      '::selection': {
        background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
      }
    });
    rendition.themes.select(currentTheme);
  };

  // When settings change, apply them to the rendition
  useEffect(() => {
    if (renditionRef.current) {
      const rendition = renditionRef.current;
      
      // Theme
      updateTheme(rendition, settings.theme);
      
      // Font size
      rendition.themes.fontSize(`${settings.fontSize}px`);
      
      // Line height
      // epubjs doesn't have a direct lineHeight method in themes easily without injecting CSS, 
      // but we can try registering a default rule or using rendition.themes.override
      rendition.themes.override('line-height', `${settings.lineHeight}`);
    }
  }, [settings, renditionRef.current]);

  const handleGetRendition = (rendition: Rendition) => {
    renditionRef.current = rendition;
    
    // Initial setup
    updateTheme(rendition, settings.theme);
    rendition.themes.fontSize(`${settings.fontSize}px`);
    rendition.themes.override('line-height', `${settings.lineHeight}`);
  };

  return (
    <div 
      style={{ position: 'relative', height: '100dvh', width: '100%', background: settings.theme === 'dark' ? '#111827' : '#FFFFFF' }}
      onTouchStart={handleTouch}
      onClick={handleTouch}
    >
      {/* Custom Top Bar */}
      <header className="reader-header safe-top" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 2,
        background: 'transparent',
        borderBottom: 'none',
        pointerEvents: 'none' // allow clicking through except for buttons
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--ui-font-family)',
            fontSize: '0.85rem',
            pointerEvents: 'auto',
            backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronLeft size={18} />
          Mbrapsht
        </button>
      </header>

      {/* Reader Container */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent'
      }}>
        <div style={{
          width: '100%',
          maxWidth: `${settings.maxWidth}px`,
          padding: `0 ${settings.hPadding}px`,
          position: 'relative',
          height: '100%'
        }}>
          <ReactReader
            url={book.fileData}
            title={book.title}
          location={location}
          locationChanged={handleLocationChanged}
          getRendition={handleGetRendition}
          epubOptions={{
            flow: 'paginated',
            manager: 'continuous',
          }}
        />
        </div>
      </div>

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
        onOpenChapters={() => {
          // Open react-reader's default TOC, but react-reader has its own TOC menu button by default.
          // If we hide it, we might need a custom one. For now, let's just close settings.
          setSettingsOpen(false);
        }}
        onBackToLibrary={onBack}
      />

      {/* CSS to hide default react-reader TOC button if we want, or adjust it */}
      <style>{`
        .ReactReader__TocButton {
          top: env(safe-area-inset-top, 0) !important;
          margin-top: 10px;
          margin-right: 10px;
        }
        .ReactReader__Container {
          padding-top: calc(env(safe-area-inset-top, 0) + 40px) !important;
        }
      `}</style>
    </div>
  );
}
