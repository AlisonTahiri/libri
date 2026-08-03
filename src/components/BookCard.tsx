import type { Book } from '../types';
import { Book as BookIcon, Sparkles, CloudDownload, CloudOff, CheckCircle2, Loader2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  isDownloaded?: boolean;
  isDownloading?: boolean;
  onDownloadClick?: (e: React.MouseEvent) => void;
}

const LANGUAGE_ABBREVIATIONS: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  sq: 'SQ',
};

export function BookCard({ book, onClick, isDownloaded, isDownloading, onDownloadClick }: BookCardProps) {
  const sourceLang = LANGUAGE_ABBREVIATIONS[book.source_language] || book.source_language.toUpperCase();
  const targetLang = LANGUAGE_ABBREVIATIONS[book.target_language] || book.target_language.toUpperCase();

  const isOriginal = book.author === 'Libri Originals';
  const displayTargetLang = isOriginal ? 'EN/SQ' : targetLang;

  return (
    <article 
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="bg-surface-container-lowest rounded-xl flex flex-col shadow-[0px_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 group cursor-pointer border border-outline-variant/20 hover:border-outline-variant/40 overflow-hidden relative"
    >
      <div className="w-full aspect-[2/3] bg-surface-variant flex items-center justify-center relative">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <BookIcon className="w-12 h-12 text-on-surface-variant opacity-30" />
        )}
        
        {/* Download Action Button */}
        {onDownloadClick && (
          <button
            onClick={onDownloadClick}
            disabled={isDownloading}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
              isDownloaded 
                ? 'bg-primary/90 text-on-primary hover:bg-error-container/90 hover:text-error' 
                : 'bg-surface/70 text-on-surface hover:bg-primary/90 hover:text-on-primary'
            }`}
            aria-label={isDownloaded ? "Remove download" : "Download book"}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isDownloaded ? (
              <span className="group-hover:hidden"><CheckCircle2 className="w-4 h-4" /></span>
            ) : (
              <CloudDownload className="w-4 h-4" />
            )}
            {/* Show CloudOff on hover if downloaded */}
            {isDownloaded && !isDownloading && (
              <span className="hidden group-hover:block"><CloudOff className="w-4 h-4" /></span>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-col p-3 flex-1">
        <h3 className="font-body-reading text-[16px] font-semibold text-on-surface leading-tight mb-1 truncate" title={book.title}>
          {book.title}
        </h3>
        
        {isOriginal ? (
          <p className="font-ui-label-sm text-[11px] text-primary flex items-center gap-1 mb-3 truncate">
            <Sparkles className="w-3 h-3" />
            Originals
          </p>
        ) : book.author ? (
          <p className="font-ui-label-sm text-[11px] text-on-surface-variant truncate mb-3" title={book.author}>
            {book.author}
          </p>
        ) : null}

        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          {book.level && (
            <span className="bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] text-white shadow-sm font-ui-label-sm text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {book.level}
            </span>
          )}
          <span className="bg-primary/10 text-primary font-ui-label-sm text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            {sourceLang} &rarr; {displayTargetLang}
          </span>
          <span className="bg-secondary/15 text-secondary font-ui-label-sm text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            {book.total_chapters} Chapters
          </span>
        </div>
      </div>
    </article>
  );
}
